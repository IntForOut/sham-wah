from fastapi import APIRouter, Depends, HTTPException
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.schemas.assets import NeighborGraph, DigitalAsset, RawEdge
from app.core.constants import ASSET_TYPE_MAP_INV
from app.core.parsers import row_to_asset
from app.config import settings

router = APIRouter(prefix="/graph", tags=["graph"])

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

    center_node = row_to_asset({
        "center": records[0]["center"],
        "nodeLabels": records[0]["nodeLabelsN"]
    }, node_key="center")

    nodes_dict[center_node.id] = center_node


    for row in records:
        if row["neighbor"] is not None:
            neighbor_node = row_to_asset({
                "neighbor": row["neighbor"],
                "nodeLabels": row["nodeLabels"]
            }, node_key="neighbor")
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