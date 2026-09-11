from fastapi import APIRouter, Depends
from app.dependencies import get_driver
from app.config import settings
from app import state



router = APIRouter(prefix="/test", tags=["test"])

@router.get("/labels")
async def get_labels(driver = Depends(get_driver)):
    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.labels()")
        records = await result.data()
    return {"labels": [r["label"] for r in records]}

@router.get("/mapping")
async def get_mapping():
    return {"mapping": state.ASSET_TYPES_MAP}

@router.get("/neighbors/node")
async def get_neighbors_node(driver = Depends(get_driver)):
    cypher = """        
    MATCH (n)
    WHERE n.uri ENDS WITH "#OVTracksMontBlancBauges2024"

    OPTIONAL MATCH p = (n)-[r]-(v)
    WHERE ALL(node IN nodes(p) WHERE node = n OR node:ns1__DataService OR node:ns1__Dataset OR node:ns4__UserFeedback OR node:ns1__Catalog)

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
        result = await session.run(cypher)
        records = await result.data()
    return {"neighbors": records}


@router.get("/sample", include_in_schema=False)
async def sample_node(driver = Depends(get_driver)):
    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(
            "MATCH (n:Resource)-[:ns6__represents]-(m:ns2__HumanActivity) RETURN n "
        )
        record = await result.single()
    return dict(record["n"]) if record else {}


@router.get("/all")
async def all_nodes(driver = Depends(get_driver)):
    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(
            """
            MATCH (n:Resource)-[:ns6__represents]-(m:ns2__HumanActivity)
            RETURN DISTINCT n
            """
        )

        nodes = []
        async for record in result:
            nodes.append(dict(record["n"]))

    return nodes
