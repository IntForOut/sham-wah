<template>
  <div class="space-y-4">
    <!-- NATURAL LANGUAGE STATEMENT -->
    <div
      class="relative overflow-hidden rounded-xl border border-gold-200 dark:border-gold-800/50 bg-gradient-to-br from-white via-gold-50/30 to-amber-50/20 dark:from-gray-900 dark:via-gold-900/10 dark:to-amber-900/5 backdrop-blur-sm"
    >
      <!-- Decorative elements -->
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 dark:bg-gold-400/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl"
      ></div>

      <div class="relative p-5">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <!-- <div
            class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-md"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div> -->

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3
              class="text-base font-semibold text-gray-900 dark:text-white mb-1"
            >
              I'm looking for resources about...
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- CONCEPT SELECTOR COMPONENT -->
    <ConceptSelector v-model="selectedConcepts" />

    <!-- FILTERS -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label
          class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
        >
          Limit
        </label>
        <input
          v-model.number="filters.limit"
          type="number"
          min="1"
          max="100"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label
          class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
        >
          Resource Type
        </label>
        <select
          v-model="filters.assetType"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all"
        >
          <option value="all">All Resource type</option>
          <option value="Dataset">Dataset</option>
          <option value="DataService">Data Service</option>
          <option value="ScientificPaper">Scientific Paper</option>
          <option value="ScientificSurvey">Scientific Survey</option>
          <option value="ScientificSurvey">Process</option>
        </select>
      </div>
    </div>

    <!-- EXECUTE BUTTON -->
    <button
      @click="executeQuery"
      :disabled="isExecuting || selectedConcepts.length === 0"
      class="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="
        isExecuting || selectedConcepts.length === 0
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
          : 'bg-gradient-to-r from-gold-500 via-gold-600 to-bronze-600 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]'
      "
    >
      <svg
        v-if="isExecuting"
        class="w-5 h-5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <svg
        v-else
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span>{{ isExecuting ? "Searching..." : "Search" }}</span>
    </button>

    <!-- RESULTS SECTION -->
    <div v-if="queryStore.results || queryStore.error" class="space-y-3">
      <!-- ERROR STATE -->
      <div
        v-if="queryStore.error"
        class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800 dark:text-red-300">
              Error
            </p>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1">
              {{ queryStore.error }}
            </p>
          </div>
        </div>
      </div>

      <!-- SUCCESS STATE WITH SCROLLABLE RESULTS -->
      <div v-else-if="queryStore.results">
        <!-- Results Header -->
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-gray-600 dark:text-gray-400">
            {{ queryStore.results.count }} result(s) •
            {{ queryStore.results.executionTime }}ms
            <span
              v-if="selectedAssets.length > 0"
              class="text-gold-600 dark:text-gold-400"
            >
              • {{ selectedAssets.length }} selected
            </span>
          </p>
          <button
            v-if="selectedAssets.length > 0"
            @click="clearSelectedAssets"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear selection
          </button>
        </div>

        <!-- Scrollable Results Container -->
        <div
          class="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          <button
            v-for="(asset, index) in queryStore.results.data"
            :key="asset.id"
            @click="toggleAssetSelection(asset)"
            class="w-full text-left p-4 rounded-lg border transition-all duration-200"
            :class="
              isAssetSelected(asset.id)
                ? 'border-gold-500 dark:border-gold-500 bg-gold-50 dark:bg-gold-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-sm'
            "
          >
            <div class="flex items-start">
              <!-- Asset Content -->
              <div class="flex-1 min-w-0 w-full">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="
                      isAssetSelected(asset.id)
                        ? 'bg-gold-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    "
                  >
                    {{ asset.type }}
                  </span>
                  <h4
                    class="text-sm font-semibold leading-snug"
                    :class="
                      isAssetSelected(asset.id)
                        ? 'text-gold-900 dark:text-gold-100'
                        : 'text-gray-900 dark:text-white'
                    "
                  >
                    {{ asset.name }}
                  </h4>
                </div>
                <p
                  class="text-xs mb-2 line-clamp-3"
                  :class="
                    isAssetSelected(asset.id)
                      ? 'text-gold-700 dark:text-gold-300'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                >
                  {{ asset.description }}
                </p>
                <!-- <div v-if="asset.concepts" class="flex flex-wrap gap-1">
                  <span
                    v-for="concept in asset.concepts"
                    :key="concept"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                    :class="
                      isAssetSelected(asset.id)
                        ? 'bg-gold-200 dark:bg-gold-800 text-gold-800 dark:text-gold-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    "
                  >
                    {{ getConceptLabel(concept) }}
                  </span>
                </div> -->
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useHumanActivitiesStore } from "~/stores/humanActivityStore";
import ConceptSelector from "./nlqPanel/ConceptSelector.vue";

// Store
const queryStore = useHumanActivitiesStore();

// Local state
const selectedConcepts = ref<string[]>([]);
const selectedAssets = ref<any[]>([]);
const isExecuting = computed(() => queryStore.isExecuting);

const filters = ref({
  limit: 10,
  assetType: "all",
});

// Watch for changes in selected concepts to clear results
watch(
  selectedConcepts,
  () => {
    queryStore.clearResults();
    selectedAssets.value = [];
  },
  { deep: true },
);

// Computed properties
const conceptsText = computed(() => {
  if (selectedConcepts.value.length === 0) return "";

  // Simple comma-separated list for modern, clean display
  return selectedConcepts.value.join(", ");
});

const generatedQuery = computed(() => {
  if (selectedConcepts.value.length === 0) return "";

  let query = "MATCH ";

  // Build asset pattern
  if (filters.value.assetType === "all") {
    query += "(asset:Dataset|ScientificPaper|ScientificSurvey)";
  } else {
    query += `(asset:${filters.value.assetType})`;
  }

  // Add relationship to concepts
  const conceptLabels = selectedConcepts.value.join("|");
  query += `-[:REPRESENTS]->(concept:${conceptLabels})`;

  // Return clause
  query += "\nRETURN asset, concept";

  // Add limit
  query += `\nLIMIT ${filters.value.limit}`;

  return query;
});

// Methods
async function executeQuery() {
  if (!generatedQuery.value || selectedConcepts.value.length === 0) return;

  // Clear previous selections
  selectedAssets.value = [];

  const queryParams = {
    query: generatedQuery.value,
    concepts: selectedConcepts.value,
    assetType: filters.value.assetType,
    limit: filters.value.limit,
  };

  await queryStore.executeQuery(queryParams);
}

// Asset selection methods
function isAssetSelected(assetId: string): boolean {
  return selectedAssets.value.some((a) => a.id === assetId);
}

function toggleAssetSelection(asset: any) {
  const index = selectedAssets.value.findIndex((a) => a.id === asset.id);
  if (index > -1) {
    selectedAssets.value.splice(index, 1);
  } else {
    selectedAssets.value.push(asset);
  }
}

function clearSelectedAssets() {
  selectedAssets.value = [];
}

// Expose selected assets for parent components
defineExpose({
  selectedAssets,
  selectedConcepts,
});
</script>

<style scoped>
/* Custom scrollbar styles for WebKit browsers */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
