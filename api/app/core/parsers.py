from app.core.constants import ASSET_TYPE_MAP_INV, IGNORED_LABELS
from app.schemas.assets import (
    DatasetAsset, DataServiceAsset, CatalogAsset, 
    UserFeedbackAsset, TechnicalDocumentAsset, ScientificPaperAsset, BaseAsset
)
import re

def split_camel_case(name: str) -> str:
    name = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", name)
    name = re.sub(r"([a-z])([A-Z])", r"\1 \2", name)
    return name


def extract_name(uri: str) -> str:
    return uri.split("#", 1)[-1]

def first_value(value, default=""):
    """Retourne le premier élément si liste, sinon la valeur brute."""
    if isinstance(value, list):
        return value[0] if value else default
    return value or default

def row_to_asset(row: dict, node_key: str = "n"):
    node = row[node_key]
    props = dict(node)
    
    node_name = split_camel_case(extract_name(props.get("uri", "")))
    raw_label = first_value(props.get("rdfs__label"), "")
    raw_comment = first_value(props.get("rdfs__comment"), "")

    node_labels = row.get("nodeLabels", [])
    valid_labels = [lbl for lbl in node_labels if lbl not in IGNORED_LABELS]
    actual_type = ASSET_TYPE_MAP_INV.get(valid_labels[0], "No Type") if valid_labels else "No Type"

    base_data = {
        "id": props.get("uri", ""),
        "name": node_name,
        "comment": raw_comment,
        "rdfs_label": raw_label if raw_label else None,
    }

    if actual_type == "Dataset":
        return DatasetAsset(
            **base_data,
            type="Dataset",
            publisher=props.get("ns4__publisher", []),
            location=props.get("ns4__location", []),
        )
        
    elif actual_type == "DataService":
        return DataServiceAsset(
            **base_data,
            type="DataService",
            publisher=props.get("ns4__publisher", []),
            location=props.get("ns4__location", []),
        )
        
    elif actual_type == "Catalog":
        return CatalogAsset(
            **base_data,
            type="Catalog",
            publisher=props.get("ns4__publisher", []),
        )
        
    elif actual_type == "UserFeedback":
        return UserFeedbackAsset(
            **base_data,
            type="UserFeedback",
            author=first_value(props.get("ns0__creator"), "Unknown")
        )
        
    elif actual_type == "TechnicalDocument":
        return TechnicalDocumentAsset(
            **base_data,
            type="TechnicalDocument",
            pdfUrl=first_value(props.get("ns0__source"), "")
        )
        
    elif actual_type == "ScientificPaper":
        return ScientificPaperAsset(
            **base_data,
            type="ScientificPaper"
        )
        
    else:
        return BaseAsset(
            **base_data
        )