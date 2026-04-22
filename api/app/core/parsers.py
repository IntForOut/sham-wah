from app.core.constants import ASSET_TYPE_MAP_INV, IGNORED_LABELS
from app.schemas.assets import DigitalAsset
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


def row_to_asset(row: dict, node_key: str = "n") -> DigitalAsset:
    node = row[node_key]
    props = dict(node)

    raw_label = first_value(props.get("rdfs__label"), "Unnamed")
    raw_comment = first_value(props.get("rdfs__comment"), "")

    node_labels = row.get("nodeLabels", [])
    valid_labels = [lbl for lbl in node_labels if lbl not in IGNORED_LABELS]
    actual_type = ASSET_TYPE_MAP_INV.get(valid_labels[0], "No Type") if valid_labels else "No Type"

    if raw_label == "Unnamed":
        node_name = split_camel_case(extract_name(props.get("uri", "")))
    else:
        node_name = raw_label

    return DigitalAsset(
        id=props.get("uri", ""),
        type=actual_type,
        name=node_name,
        comment=raw_comment,
        publisher=props.get("ns4__publisher", []),
        location=props.get("ns4__location", []),
    )

