from app import state
from app.config import settings
from app.core.constants import ASSET_TYPES, ASSET_RELATIONSHIPS, CONCEPT_LABEL
from app.utils.mapping import build_mapping


async def load_labels():
    async with state.driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.labels()")
        state.LABEL_CACHE = [record["label"] for record in await result.data()]
    state.ASSET_TYPES_MAP = build_mapping(state.LABEL_CACHE, ASSET_TYPES)
    state.ASSET_TYPE_MAP_INV = {v: k for k, v in state.ASSET_TYPES_MAP.items()}
    state.CONCEPT_MAP = build_mapping(state.LABEL_CACHE, CONCEPT_LABEL)


    print("Labels chargés :", state.LABEL_CACHE)
    print("\nMapping type construit :", state.ASSET_TYPES_MAP)
    print("\nMapping inversé :", state.ASSET_TYPE_MAP_INV)
    print("\nMapping concept construit : ", state.CONCEPT_MAP)


async def load_relationships():
    async with state.driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.relationshipTypes()")
        state.RELATIONSHIP_CACHE[:] = [record["relationshipType"] for record in await result.data()]

    state.RELATIONSHIP_MAP = build_mapping(state.RELATIONSHIP_CACHE, ASSET_RELATIONSHIPS)
    state.RELATIONSHIP_MAP_INV = {v: k for k, v in state.RELATIONSHIP_MAP.items()}

    print("\n---------------------RELATIONSHIPS---------------------\n")
    print("Relations chargées :", state.RELATIONSHIP_CACHE)
    print("\nMapping construit :", state.RELATIONSHIP_MAP)
    print("\nMapping inversé :", state.RELATIONSHIP_MAP_INV)