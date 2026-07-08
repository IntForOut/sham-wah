import time
from fastapi import APIRouter, Depends, HTTPException
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.schemas.assets import QueryParams, QueryResult
from app.core.constants import ASSET_TYPE_MAP, CONCEPT_LABEL_MAP
from app.core.parsers import row_to_asset
from app.config import settings

router = APIRouter(prefix="/assets", tags=["assets"])


@router.post("/query", response_model=QueryResult)
async def query_assets(
    params: QueryParams,
    driver: AsyncDriver = Depends(get_driver),
):
    start = time.monotonic()
    
    try:
        cypher, query_params = _build_cypher(params)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(cypher, query_params)
        records = await result.data()
    
    assets = [row_to_asset(r, node_key="n") for r in records]
    elapsed_ms = int((time.monotonic() - start) * 1000)

    return QueryResult(count=len(assets), executionTime=elapsed_ms, data=assets)

def _build_cypher(params: QueryParams):
    p = {"limit": params.limit}

    unknown = [c for c in params.concepts if c not in CONCEPT_LABEL_MAP]
    if unknown:
        raise ValueError(f"Unknown concepts: {unknown}")
    
    if "HumanActivity" in params.concepts or "AnimalActivity" in params.concepts:
        cypher = f"""
            OPTIONAL MATCH (cls1:Resource)-[r1]->(parent1:Resource)
            WHERE type(r1) CONTAINS "subClassOf"
            AND parent1.uri ENDS WITH "LandEntity"
            WITH collect(split(cls1.uri, "#")[-1]) + ["LandEntity"] AS landClasses

            OPTIONAL MATCH (cls2:Resource)-[r2]->(parent2:Resource)
            WHERE type(r2) CONTAINS "subClassOf"
            AND parent2.uri ENDS WITH "{params.concepts[0]}"
            WITH landClasses, collect(split(cls2.uri, "#")[-1]) + ["{params.concepts[0]}"] AS activityClasses

            OPTIONAL MATCH (n1:Resource)-[:ns4__represents]->(ha)
            WHERE any(label IN labels(ha) WHERE label IN [cls IN activityClasses | "ns2__" + cls])
            WITH landClasses, activityClasses, collect(DISTINCT n1) AS list1

            WITH landClasses, activityClasses, list1

            OPTIONAL MATCH (n2:Resource)-[:ns4__represents]->(le)-[:ns2__affords]->(ha2)
            WHERE any(label IN labels(le) WHERE label IN [cls IN landClasses | "ns2__" + cls])
            AND any(label IN labels(ha2) WHERE label IN [cls IN activityClasses | "ns2__" + cls])
            WITH list1, collect(DISTINCT n2) AS list2

            WITH list1 + list2 AS allNodes

            UNWIND allNodes AS n
            RETURN DISTINCT n, labels(n) AS nodeLabels
            LIMIT $limit
        """
        return cypher, p

    asset_label = ASSET_TYPE_MAP.get(params.assetType, "Resource")
    activity_labels = [CONCEPT_LABEL_MAP[c] for c in params.concepts]

    match_clause = f"(n:{asset_label})"
    if activity_labels:
        match_clause += f"-[:ns4__represents]-(m:{'|'.join(activity_labels)})"

    cypher = f"""
        MATCH {match_clause}
        RETURN DISTINCT n, labels(n) AS nodeLabels
        LIMIT $limit
    """

    return cypher, p
