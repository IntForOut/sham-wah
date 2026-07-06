from typing import Literal, Union, Optional
from typing_extensions import Annotated
from pydantic import BaseModel, Field


class BaseAsset(BaseModel):
    id: str
    name: str
    comment: str
    rdfs_label: Optional[str] = None

class DatasetAsset(BaseAsset):
    type: Literal["Dataset"]
    publisher: Optional[list[str]] = None
    location: Optional[list[str]] = None
    issued: Optional[str] = None

class DataServiceAsset(BaseAsset):
    type: Literal["DataService"]
    publisher: Optional[list[str]] = None
    location: Optional[list[str]] = None
    seealso: Optional[str] = None

class CatalogAsset(BaseAsset):
    type: Literal["Catalog"]
    publisher: Optional[list[str]] = None
    homepage: Optional[str] = None

class UserFeedbackAsset(BaseAsset):
    type: Literal["UserFeedback"]
    author: str

class TechnicalDocumentAsset(BaseAsset):
    type: Literal["TechnicalDocument"]
    pdfUrl: str
    author: str

class ScientificPaperAsset(BaseAsset):
    type: Literal["ScientificPaper"]
    authorID: str
    publisher: str
    publication_year: str
    subject: Optional[list[str]] = None

class ProcessAsset(BaseAsset):
    type: Literal["Process"]

    
DigitalAsset = Annotated[
    Union[
        DatasetAsset,
        DataServiceAsset,
        CatalogAsset,
        UserFeedbackAsset,
        TechnicalDocumentAsset,
        ScientificPaperAsset,
        ProcessAsset
    ],
    Field(discriminator="type")
]
    
    
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