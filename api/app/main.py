from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neo4j import AsyncGraphDatabase
from app.dependencies import  close_driver
from app.routers import assets, graph, test, db
from app.config import settings
from app import state


async def load_labels_once():
    async with state.driver.session(database=settings.neo4j_database) as session:
        result = await session.run("CALL db.labels()")
        state.LABEL_CACHE = [record["label"] for record in await result.data()]
    print("Labels chargés :", state.LABEL_CACHE)


@asynccontextmanager
async def lifespan(app: FastAPI):

    state.driver = AsyncGraphDatabase.driver(
        settings.neo4j_url,
        auth=(settings.neo4j_user, settings.neo4j_password)
    )
    
    await load_labels_once()
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

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}