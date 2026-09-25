from fastapi import APIRouter
from app.services.metadata import load_labels, load_relationships
from app import state

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/reload-metadata")
async def reload_metadata():
    await load_labels()
    await load_relationships()
    return {
        "status": "ok",
        "labels": state.LABEL_CACHE,
        "relationships": state.RELATIONSHIP_CACHE,
    }
