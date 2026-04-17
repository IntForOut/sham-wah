from fastapi import APIRouter, Depends
from neo4j import AsyncDriver
from app.dependencies import get_driver
from app.config import settings
from fastapi import HTTPException

router = APIRouter(prefix="/db", tags=["health"])
 
@router.get("/ready")
async def ready(driver: AsyncDriver = Depends(get_driver)):
    try:
        async with driver.session(database=settings.neo4j_database) as session:
            result = await session.run("RETURN 1 AS ok")
            await result.single()
        return {"status": "ok", "neo4j": True}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Neo4j error: {str(e)}"
        )
