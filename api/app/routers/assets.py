import time
from fastapi import APIRouter, Depends
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.models.assets import QueryParams, QueryResult, DigitalAsset
from app.config import settings

router = APIRouter(prefix="/assets", tags=["assets"])

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


def _row_to_asset(row: dict) -> DigitalAsset:
    node = row["n"]
    props = dict(node)

    raw_label = props.get("rdfs__label", ["Unnamed"])
    raw_comment = props.get("rdfs__comment", [""])

    ignored_labels = {"Resource", "owl__NamedIndividual"}
    node_labels = row.get("nodeLabels", [])
    actual_type = next(
        (l for l in node_labels if l not in ignored_labels),
        "Resource"
    )

    return DigitalAsset(
        id=props.get("uri", ""),
        type=actual_type,
        name=raw_label[0] if isinstance(raw_label, list) else raw_label,
        comment=raw_comment[0] if isinstance(raw_comment, list) else raw_comment,
        publisher=props.get("ns1__publisher") or props.get("ns4__publisher"),
        location=props.get("ns4__location"),
        concepts=[],
    )

@router.post("/query", response_model=QueryResult)
async def query_assets(
    params: QueryParams,
    driver: AsyncDriver = Depends(get_driver),
):
    start = time.monotonic()
    cypher, query_params = _build_cypher(params)

    async with driver.session(database=settings.neo4j_database) as session:
        result = await session.run(cypher, query_params)
        records = await result.data()

    assets = [_row_to_asset(r) for r in records]
    elapsed_ms = int((time.monotonic() - start) * 1000)

    return QueryResult(count=len(assets), executionTime=elapsed_ms, data=assets)


def _build_cypher(params: QueryParams) -> tuple[str, dict]:
    p: dict = {"limit": params.limit}

    activity_labels = [
        CONCEPT_LABEL_MAP[c]
        for c in params.concepts
        if c in CONCEPT_LABEL_MAP
    ]
    asset_type_label = ASSET_TYPE_MAP.get(params.assetType, "Resource")
    
    if activity_labels:
        activity_label_clause = "|".join(activity_labels)
    else:
        activity_label_clause = "ns2__HumanActivity"

    cypher = f"""
        MATCH (n:{asset_type_label})-[:ns6__represents]-(m:{activity_label_clause})
        RETURN DISTINCT n
        LIMIT $limit
    """
    return cypher, p