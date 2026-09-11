def build_mapping(labels, asset_types):
    mapping = {}

    for label in labels:
        if "__" not in label:
            continue

        prefix, suffix = label.split("__", 1)

        if suffix in asset_types:
            mapping[suffix] = label

    return mapping