from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neo4j import AsyncGraphDatabase
from app.dependencies import  close_driver
from app import state
from app.config import settings
from app.services.labels import load_labels
from app.routers import assets, graph, test, db, admin



@asynccontextmanager
async def lifespan(app: FastAPI):

    state.driver = AsyncGraphDatabase.driver(
        settings.neo4j_url,
        auth=(settings.neo4j_user, settings.neo4j_password)
    )
    
    await load_labels()
    yield
    await close_driver()

app = FastAPI(title="Sham-Wah API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(assets.router)
app.include_router(graph.router)
app.include_router(test.router)
app.include_router(db.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}