ASSET_TYPE_MAP = {
    "Dataset":        "ns1__Dataset",
    "DataService":    "ns1__DataService",
    "ScientificPaper":"ns4__ScientificPaper",
    "Process":        "ns4__Process",
    "DatasetSeries":  "ns1__DatasetSeries",
    "UserFeedback":   "ns4__UserFeedback",
    "Catalog":        "ns1__Catalog",
    "TechnicalDocument":"ns2__TechnicalDocument",
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
