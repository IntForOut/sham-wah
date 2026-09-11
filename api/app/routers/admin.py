from fastapi import APIRouter
from app.services.labels import load_labels
from app import state

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/reload-labels")
async def reload_labels():
    await load_labels()
    return {
        "status": "ok",
        "labels": state.LABEL_CACHE
    }
