from fastapi import APIRouter, Depends, HTTPException
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.models.assets import NeighborGraph, DigitalAsset, RawEdge
from app.config import settings

router = APIRouter(prefix="/graph", tags=["graph"])

ASSET_TYPE_MAP = {
    "Dataset":        "ns1__Dataset",
    "DataService":    "ns1__DataService",
    "ScientificPaper":"ns6__ScientificPaper",
    "Process":        "ns6__Process",
    "DatasetSeries":  "ns1__DatasetSeries",
}

CONCEPT_LABEL_MAP = {
    "Hiking":             "ns2__Hiking",
    "HumanActivity":      "ns2__HumanActivity",
    "PopulationFootprint":"ns2__PopulationFootprint",
    "Sentier":            "ns2__Sentier",
    "ReservesNaturelles": "ns2__ReservesNaturelles",
}

ASSET_TYPE_MAP_INV = {v: k for k, v in ASSET_TYPE_MAP.items()}

def _row_to_asset(row: dict) -> DigitalAsset:
    node = row["v"]
    props = dict(node)

    raw_label = props.get("rdfs__label", ["Unnamed"])
    raw_comment = props.get("rdfs__comment", [""])

    ignored_labels = {"Resource", "owl__NamedIndividual"}
    node_labels = row.get("nodeLabels", [])
    
    valid_labels = [l for l in node_labels if l not in ignored_labels]
    actual_type = ASSET_TYPE_MAP_INV.get(valid_labels[0], "DATA") if valid_labels else "DATA"


    return DigitalAsset(
        id=props.get("uri", ""),
        type=actual_type,
        name=raw_label[0] if isinstance(raw_label, list) else raw_label,
        comment=raw_comment[0] if isinstance(raw_comment, list) else raw_comment,
        publisher=props.get("ns4__publisher", []),
        location=props.get("ns4__location", []),
    )



@router.get("/neighbors/{asset_id}", response_model=NeighborGraph)
async def get_neighbors(
    asset_id: str,
    driver: AsyncDriver = Depends(get_driver),
):
    cypher = """        
        MATCH (n)
        WHERE n.uri ENDS WITH $suffix
        
        OPTIONAL MATCH p = (n)-[r]-(v)
        WHERE ALL(node IN nodes(p) WHERE node = n OR node:ns1__DataService OR node:ns1__Dataset OR node:ns6__UserFeedback OR node:ns1__Catalog)
        
        RETURN 
            n AS center, 
            labels(n) AS nodeLabelsN,
            v AS neighbor, 
            labels(v) AS nodeLabels, 
            type(r) AS rel_type,
            startNode(r).uri AS source_uri, 
            endNode(r).uri AS target_uri
    """
    
    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(cypher, {"suffix": asset_id})
        records = await result.data()

    if not records:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    nodes_dict = {} 
    edges = []

    center_node = _row_to_asset({
        "v": records[0]["center"],
        "nodeLabels": records[0]["nodeLabelsN"]
    })
    nodes_dict[center_node.id] = center_node


    for row in records:
        if row["neighbor"] is not None:
            neighbor_node = _row_to_asset({
                "v": row["neighbor"],
                "nodeLabels": row["nodeLabels"]
            })
            nodes_dict[neighbor_node.id] = neighbor_node

            edges.append(RawEdge(
                source=row["source_uri"],
                target=row["target_uri"],
                label=row["rel_type"]
            ))

    return NeighborGraph(
        nodes=list(nodes_dict.values()),
        edges=edges
    )