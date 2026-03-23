import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Concept {
  value: string;
  label: string;
}

export interface ConceptCategory {
  name: string;
  label: string;
  rootConcept: string;
  concepts: Concept[];
}

export interface QueryFilters {
  limit: number;
  assetType: string;
  dateStart: string | null;
  dateEnd: string | null;
}

export const CONCEPT_CATEGORIES: ConceptCategory[] = [
  {
    name: "humanActivity",
    label: "Human Activity",
    rootConcept: "HumanActivity",
    concepts: [
      { value: "Hiking", label: "Hiking" },
      { value: "FastHiking", label: "Fast Hiking" },
      { value: "Cycling", label: "Cycling" },
    ],
  },
  {
    name: "animalActivity",
    label: "Animal Activity",
    rootConcept: "AnimalActivity",
    concepts: [],
  },
  {
    name: "land",
    label: "Land Entities",
    rootConcept: "LandEntity",
    concepts: [
      { value: "SensitiveArea", label: "Sensitive Area" },
      { value: "AireProtegee", label: "Aire protégée" },
      { value: "AireDetente", label: "Aire de détente" },
      { value: "AireCampingCar", label: "Aire Camping Car" },
      { value: "Landmark", label: "Landmark" },
      { value: "EncounteringZone", label: "Encountering Zone" },
      { value: "ReservesNaturelles", label: "Réserves naturelles" },
      { value: "PlandEau", label: "Plan d'eau" },
      { value: "PopulationFootprint", label: "Population Footprint" },
      { value: "Sentier", label: "Sentier" },
      { value: "Trajectory", label: "Trajectory" },
      { value: "Route", label: "Route" },
    ],
  },
];

export const ASSET_TYPES = [
  { value: "all", label: "All Resource Types" },
  { value: "Dataset", label: "Dataset" },
  { value: "DataService", label: "Data Service" },
  { value: "ScientificPaper", label: "Scientific Paper" },
  { value: "Process", label: "Process" },
] as const;

export type AssetTypeValue = (typeof ASSET_TYPES)[number]["value"];

const DEFAULT_FILTERS: QueryFilters = {
  limit: 15,
  assetType: "all",
  dateStart: null,
  dateEnd: null,
};

export const usePredefinedQueryStore = defineStore("predefinedQuery", () => {
  const selectedCategoryName = ref<string>("");
  const selectedConceptValues = ref<string[]>([]);
  const filters = ref<QueryFilters>({ ...DEFAULT_FILTERS });

  const selectedCategory = computed(
    () =>
      CONCEPT_CATEGORIES.find((c) => c.name === selectedCategoryName.value) ??
      null,
  );

  const availableConcepts = computed(
    () => selectedCategory.value?.concepts ?? [],
  );

  const hasCategorySelected = computed(() => !!selectedCategoryName.value);

  const effectiveConcepts = computed<string[]>(() => {
    if (selectedConceptValues.value.length > 0)
      return selectedConceptValues.value;
    if (selectedCategory.value) return [selectedCategory.value.rootConcept];
    return [];
  });

  function setCategory(categoryName: string) {
    selectedCategoryName.value = categoryName;
    selectedConceptValues.value = [];
  }

  function toggleConcept(value: string) {
    const idx = selectedConceptValues.value.indexOf(value);
    selectedConceptValues.value =
      idx === -1
        ? [...selectedConceptValues.value, value]
        : selectedConceptValues.value.filter((v) => v !== value);
  }

  function clearConcepts() {
    selectedConceptValues.value = [];
  }

  function setFilters(updated: Partial<QueryFilters>) {
    filters.value = { ...filters.value, ...updated };
  }

  function reset() {
    selectedCategoryName.value = "";
    selectedConceptValues.value = [];
    filters.value = { ...DEFAULT_FILTERS };
  }

  return {
    // State
    selectedCategoryName,
    selectedConceptValues,
    filters,
    // Getters
    selectedCategory,
    availableConcepts,
    effectiveConcepts,
    hasCategorySelected,
    // Actions
    setCategory,
    toggleConcept,
    clearConcepts,
    setFilters,
    reset,
  };
});
