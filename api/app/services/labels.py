from app import state
from app.config import settings
from app.core.constants import ASSET_TYPES
from app.utils.mapping import build_label_mapping


async def load_labels():
    async with state.driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.labels()")
        state.LABEL_CACHE = [record["label"] for record in await result.data()]
    state.ASSET_TYPES_MAP = build_label_mapping(state.LABEL_CACHE, ASSET_TYPES)
    state.ASSET_TYPE_MAP_INV = {v: k for k, v in state.ASSET_TYPES_MAP.items()}


    print("Labels chargés :", state.LABEL_CACHE)
    print("\nMapping construit :", state.ASSET_TYPES_MAP)
    print("\nMapping inversé :", state.ASSET_TYPE_MAP_INV)

