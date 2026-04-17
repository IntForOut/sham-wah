from fastapi import APIRouter, Depends, HTTPException
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.schemas.assets import NeighborGraph, RawEdge
from app.core.parsers import row_to_asset
from app.config import settings

router = APIRouter(prefix="/graph", tags=["graph"])

@router.get("/neighbors", response_model=NeighborGraph)
async def get_neighbors(
    asset_id: str,
    depth: int = 1,
    driver: AsyncDriver = Depends(get_driver),
):
    if depth < 1 or depth > 2:
        raise HTTPException(status_code=400, detail="Depth must be between 1 and 2")

    cypher = f"""
        MATCH (n)
        WHERE n.uri ENDS WITH $suffix
        
        OPTIONAL MATCH p = (n)-[*1..{depth}]-(v)
        WHERE ALL(node IN nodes(p) WHERE 
            node = n OR 
            node:ns1__DataService OR 
            node:ns1__Dataset OR 
            node:ns6__UserFeedback OR 
            node:ns1__Catalog
        )
        
        RETURN 
            n AS center,
            labels(n) AS nodeLabelsN,
            [node IN nodes(p) | node] AS pathNodes,
            [node IN nodes(p) | labels(node)] AS pathNodeLabels,
            [rel IN relationships(p) | {{
                rel_type: type(rel),
                source_uri: startNode(rel).uri,
                target_uri: endNode(rel).uri
            }}] AS pathEdges
    """

    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(cypher, {"suffix": asset_id})
        records = await result.data()

    if not records:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    nodes_dict = {} 
    edges_set = set()
    edges = []

    center_node = row_to_asset({
        "center": records[0]["center"],
        "nodeLabels": records[0]["nodeLabelsN"]
    }, node_key="center")

    for row in records:
        if row["pathNodes"] is None:
            continue

        for node_data, labels in zip(row["pathNodes"], row["pathNodeLabels"]):
            neighbor_node = row_to_asset({
                "neighbor": node_data,
                "nodeLabels": labels
            }, node_key="neighbor")
            
            if neighbor_node.id == center_node.id:
                continue 
            
            nodes_dict[neighbor_node.id] = neighbor_node

        for edge_data in row["pathEdges"]:
            edge_tuple = (edge_data["source_uri"], edge_data["target_uri"], edge_data["rel_type"])
            
            if edge_tuple not in edges_set:
                edges_set.add(edge_tuple)
                edges.append(RawEdge(
                    source=edge_data["source_uri"],
                    target=edge_data["target_uri"],
                    label=edge_data["rel_type"]
                ))
        
    return NeighborGraph(
        nodes=list(nodes_dict.values()),
        edges=edges
    )