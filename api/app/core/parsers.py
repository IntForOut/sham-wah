from app.core.constants import ASSET_TYPE_MAP_INV, IGNORED_LABELS
from app.schemas.assets import (
    DatasetAsset, DataServiceAsset, CatalogAsset,
    UserFeedbackAsset, TechnicalDocumentAsset, ScientificPaperAsset,
)
import re


def split_camel_case(name: str) -> str:
    name = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", name)
    name = re.sub(r"([a-z])([A-Z])", r"\1 \2", name)
    return name


def extract_name(uri: str) -> str:
    return uri.split("#", 1)[-1]


def first_value(value, default=None):
    """Return the first element if a list, otherwise the raw value.
    Neo4j can return dates, URIs, etc. as single-element lists.
    """
    if isinstance(value, list):
        return value[0] if value else default
    return value if value is not None else default


def to_str(value, default=None) -> str | None:
    """Extract first value from a list and coerce to str (handles
    neo4j.time.Date, neo4j.time.DateTime, URIRef, plain str, etc.).
    Returns default when the value is absent/empty.
    """
    v = first_value(value, default)
    if v is None:
        return default
    return str(v) if not isinstance(v, str) else v


def to_str_list(value) -> list[str] | None:
    """Coerce a Neo4j property that may be a list of any type to list[str],
    or None when absent/empty.
    """
    if not value:
        return None
    if not isinstance(value, list):
        value = [value]
    result = [str(v) for v in value if v is not None]
    return result if result else None


def row_to_asset(row: dict, node_key: str = "n"):
    node = row[node_key]
    props = dict(node)

    uri         = props.get("uri", "")
    node_name   = split_camel_case(extract_name(uri))
    raw_label   = to_str(props.get("rdfs__label"))
    raw_comment = to_str(    props.get("rdfs__comment")
    or props.get("ns0__description")
    or "",
    "")

    node_labels  = row.get("nodeLabels", [])
    valid_labels = [lbl for lbl in node_labels if lbl not in IGNORED_LABELS]
    actual_type  = ASSET_TYPE_MAP_INV.get(valid_labels[0], "Dataset") if valid_labels else "Dataset"

    base = dict(
        id=uri,
        name=node_name,
        comment=raw_comment,
        rdfs_label=raw_label,
    )

    match actual_type:
        case "Dataset":
            return DatasetAsset(
                **base,
                type="Dataset",
                publisher=to_str_list(props.get("ns4__publisher")),
                location=to_str_list(props.get("ns4__location")),
                issued=to_str(props.get("ns0__issued")),
            )

        case "DataService":
            return DataServiceAsset(
                **base,
                type="DataService",
                publisher=to_str_list(props.get("ns4__publisher")),
                location=to_str_list(props.get("ns4__location")),
                seealso=to_str(props.get("rdfs__seeAlso")),
            )

        case "Catalog":
            return CatalogAsset(
                **base,
                type="Catalog",
                publisher=to_str_list(props.get("ns4__publisher")),
                homepage=to_str(props.get("ns5__homepage")),
            )

        case "UserFeedback":
            return UserFeedbackAsset(
                **base,
                type="UserFeedback",
                author=to_str(props.get("ns0__creator"), ""),
            )

        case "TechnicalDocument":
            return TechnicalDocumentAsset(
                **base,
                type="TechnicalDocument",
                pdfUrl=to_str(props.get("ns0__source"), ""),
                author=to_str(props.get("ns0__creator"), ""),
            )

        case "ScientificPaper":
            return ScientificPaperAsset(
                **base,
                type="ScientificPaper",
                authorID=to_str(props.get("ns4__relatedIdentifier"), ""),
                publisher=to_str(props.get("ns0__publisher"), ""),
                publication_year=to_str(props.get("ns4__publicationYear"), ""),
                subject=to_str_list(props.get("ns4__subject")),
            )

        case _:
            return DatasetAsset(**base, type="Dataset")