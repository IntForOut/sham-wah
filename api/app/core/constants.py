ASSET_TYPE_MAP = {
    "Dataset":        "ns1__Dataset",
    "DataService":    "ns1__DataService",
    "ScientificPaper":"ns6__ScientificPaper",
    "Process":        "ns6__Process",
    "DatasetSeries":  "ns1__DatasetSeries",
}

CONCEPT_LABEL_MAP = {
    "Hiking":             "ns2__Hiking",
    "HumanActivity":      "ns2__HumanActivity",
    "PopulationFootprint":"ns2__PopulationFootprint",
    "Sentier":            "ns2__Sentier",
    "ReservesNaturelles": "ns2__ReservesNaturelles",
}

ASSET_TYPE_MAP_INV = {v: k for k, v in ASSET_TYPE_MAP.items()}

IGNORED_LABELS = {"Resource", "owl__NamedIndividual"}
