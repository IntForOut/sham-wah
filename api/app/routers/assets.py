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

    asset_label = ASSET_TYPE_MAP.get(params.assetType, "Resource")
    activity_labels = [CONCEPT_LABEL_MAP[c] for c in params.concepts]

    match_clause = f"(n:{asset_label})"
    if activity_labels:
        match_clause += f"-[:ns6__represents]-(m:{'|'.join(activity_labels)})"

    cypher = f"""
        MATCH {match_clause}
        RETURN DISTINCT n, labels(n) AS nodeLabels
        LIMIT $limit
    """

    return cypher, p