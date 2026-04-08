from app.core.constants import ASSET_TYPE_MAP_INV, IGNORED_LABELS
from app.schemas.assets import DigitalAsset

def row_to_asset(row: dict, node_key: str = "n") -> DigitalAsset:
    node = row[node_key]
    props = dict(node)

    raw_label = props.get("rdfs__label", ["Unnamed"])
    raw_comment = props.get("rdfs__comment", [""])

    node_labels = row.get("nodeLabels", [])
    valid_labels = [l for l in node_labels if l not in IGNORED_LABELS]

    actual_type = ASSET_TYPE_MAP_INV.get(valid_labels[0], "DATA") if valid_labels else "DATA"

    return DigitalAsset(
        id=props.get("uri", ""),
        type=actual_type,
        name=raw_label[0] if isinstance(raw_label, list) else raw_label,
        comment=raw_comment[0] if isinstance(raw_comment, list) else raw_comment,
        publisher=props.get("ns4__publisher", []),
        location=props.get("ns4__location", []),
    )
