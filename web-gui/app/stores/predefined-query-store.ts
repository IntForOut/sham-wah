import { defineStore } from "pinia";
import { ref, computed } from "vue";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Concept {
  value: string;
  label: string;
}

export interface ConceptCategory {
  name: string;
  label: string;
  concepts: Concept[];
}

export interface QueryFilters {
  limit: number;
  assetType: string;
  dateStart: string | null;
  dateEnd: string | null;
}

// ─── Static data ──────────────────────────────────────────────────────

export const CONCEPT_CATEGORIES: ConceptCategory[] = [
  {
    name: "humanActivity",
    label: "Human Activity",
    concepts: [
      { value: "Hiking", label: "Hiking" },
      { value: "FastHiking", label: "FastHiking" },
      { value: "Cycling", label: "Cycling" },
    ],
  },
  {
    name: "animalActivity",
    label: "Animal Activity",
    concepts: [],
  },
  {
    name: "land",
    label: "Land Entities",
    concepts: [
      { value: "SensitiveArea", label: "Sensitive Area" },
      { value: "AireProtegee", label: "Aire protégée" },
      { value: "AireDetente", label: "Aire de détente" },
      { value: "AireCampingCar", label: "Aire Camping Car" },
      { value: "Landmark", label: "Landmark" },
      { value: "EncounteringZone", label: "Encountering Zone" },
      { value: "ReservesNaturelles", label: "Reserves naturelles" },
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
  { value: "ScientificSurvey", label: "Scientific Survey" },
  { value: "Process", label: "Process" },
] as const;

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePredefinedQueryStore = defineStore("predefinedQuery", () => {
  // State
  const selectedCategoryName = ref<string>("");
  const selectedConceptValues = ref<string[]>([]);
  const filters = ref<QueryFilters>({
    limit: 15,
    assetType: "all",
    dateStart: null,
    dateEnd: null,
  });

  // Getters
  const selectedCategory = computed(
    () =>
      CONCEPT_CATEGORIES.find((c) => c.name === selectedCategoryName.value) ??
      null,
  );

  const availableConcepts = computed(
    () => selectedCategory.value?.concepts ?? [],
  );

  /**
   * Concepts used for the actual query:
   * - If the user picked specific concepts → use those
   * - If only a category is selected → use all concepts from that category
   * - Otherwise → empty array
   */
  const effectiveConcepts = computed<string[]>(() => {
    if (selectedConceptValues.value.length > 0)
      return selectedConceptValues.value;
    if (selectedCategoryName.value)
      return availableConcepts.value.map((c) => c.value);
    return [];
  });

  const hasCategorySelected = computed(() => !!selectedCategoryName.value);

  // Actions
  function setCategory(categoryName: string) {
    selectedCategoryName.value = categoryName;
    selectedConceptValues.value = []; // reset specific concepts on category change
  }

  function toggleConcept(value: string) {
    const idx = selectedConceptValues.value.indexOf(value);
    if (idx === -1) {
      selectedConceptValues.value = [...selectedConceptValues.value, value];
    } else {
      selectedConceptValues.value = selectedConceptValues.value.filter(
        (v) => v !== value,
      );
    }
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
    filters.value = {
      limit: 15,
      assetType: "all",
      dateStart: null,
      dateEnd: null,
    };
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
