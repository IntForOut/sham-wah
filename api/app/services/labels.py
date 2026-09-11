from app import state
from app.config import settings

async def load_labels():
    async with state.driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.labels()")
        state.LABEL_CACHE = [record["label"] for record in await result.data()]
    print("Labels chargés :", state.LABEL_CACHE)

