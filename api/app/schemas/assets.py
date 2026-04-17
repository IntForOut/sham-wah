from pydantic import BaseModel

# query-result-store.ts
class DigitalAsset(BaseModel):
    id: str
    type: str
    name: str
    comment: str
    publisher: list[str] | None = None
    location: list[str] | None = None

class QueryResult(BaseModel):
    count: int
    executionTime: int   # ms
    data: list[DigitalAsset]

class QueryParams(BaseModel):
    concepts: list[str] = []
    assetType: str = "all"
    limit: int = 15

# graph-store.ts
class RawEdge(BaseModel):
    source: str
    target: str
    label: str

class NeighborGraph(BaseModel):
    nodes: list[DigitalAsset]
    edges: list[RawEdge]