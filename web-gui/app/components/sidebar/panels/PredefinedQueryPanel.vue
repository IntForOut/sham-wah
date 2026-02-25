<template>
  <div class="space-y-6">
    <!-- Row 1: sentence + [selector + quick search button] always on one line -->
    <div class="flex items-center gap-3 flex-wrap">
      <h3
        class="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap shrink-0"
      >
        I'm looking for data about
      </h3>

      <!-- Selector + button as a single input-group -->
      <div
        class="flex flex-1 min-w-[220px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-gold-500 dark:focus-within:ring-gold-400 transition-all"
      >
        <ConceptSelector
          :disabled="queryStore.isExecuting"
          class="flex-1 border-none ring-0 focus-within:ring-0 rounded-none"
        />
        <button
          :disabled="queryStore.isExecuting || !filterStore.hasCategorySelected"
          class="shrink-0 px-3 flex items-center justify-center border-l border-gray-200 dark:border-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="
            queryStore.isExecuting
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              : 'bg-gradient-to-b from-gold-500 to-gold-600 text-white hover:from-gold-400 hover:to-gold-500 active:from-gold-600 active:to-gold-700'
          "
          title="Search"
          @click="executeQuery"
        >
          <svg
            v-if="queryStore.isExecuting"
            class="w-4 h-4 animate-spin"
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
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4"
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
        </button>
      </div>
    </div>

    <!-- Filters accordion -->
    <AppAccordion :default-open="false">
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
      </template>
      <template #title>Filters</template>

      <QueryFilters
        :is-executing="queryStore.isExecuting"
        @search="executeQuery"
        @reset="resetAll"
      />
    </AppAccordion>

    <!-- Results section -->
    <div v-if="queryStore.results || queryStore.error">
      <!-- Error state -->
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
          <div>
            <p class="text-sm font-medium text-red-800 dark:text-red-300">
              Error
            </p>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1">
              {{ queryStore.error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Success state -->
      <div v-else-if="queryStore.results">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {{ queryStore.results.count }} result(s) ·
          {{ queryStore.results.executionTime }}ms
        </p>
        <div class="flex flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin">
          <AssetCard
            v-for="asset in queryStore.results.data"
            :key="asset.id"
            :asset="asset"
            :selected="selectedAsset?.id === asset.id"
            @toggle="toggleAssetSelection"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useHumanActivitiesStore } from "~/stores/humanActivityStore";
import { usePredefinedQueryStore } from "~/stores/predefinedQueryStore";
import AppAccordion from "~/components/sidebar/panels/AppAccordion.vue";
import ConceptSelector from "./predefinedQueryPanel/ConceptSelector.vue";
import QueryFilters from "./predefinedQueryPanel/QueryFilters.vue";
import AssetCard from "./predefinedQueryPanel/AssetCard.vue";

// ─── Stores ───────────────────────────────────────────────────────────────────

const queryStore = useHumanActivitiesStore();
const filterStore = usePredefinedQueryStore();

// ─── Local state ──────────────────────────────────────────────────────────────

/** Only one asset can be selected at a time */
const selectedAsset = ref<any | null>(null);

// ─── Query builder ────────────────────────────────────────────────────────────

const generatedQuery = computed(() => {
  const { assetType, limit } = filterStore.filters;
  const concepts = filterStore.effectiveConcepts;

  const assetLabel =
    assetType === "all"
      ? "Dataset|DataService|ScientificPaper|ScientificSurvey|Process"
      : assetType;

  let query = `MATCH (asset:${assetLabel})`;

  if (concepts.length > 0) {
    query += `-[:REPRESENTS]->(concept:${concepts.join("|")})`;
    query += "\nRETURN asset, concept";
  } else {
    query += "\nRETURN asset";
  }

  query += `\nLIMIT ${limit}`;
  return query;
});

// ─── Side effects ─────────────────────────────────────────────────────────────

watch(
  [
    () => filterStore.selectedCategoryName,
    () => filterStore.selectedConceptValues,
    () => filterStore.filters,
  ],
  () => {
    queryStore.clearResults();
    selectedAsset.value = null;
  },
  { deep: true },
);

// ─── Methods ──────────────────────────────────────────────────────────────────

async function executeQuery() {
  if (!filterStore.hasCategorySelected) return;
  selectedAsset.value = null;
  await queryStore.executeQuery({
    query: generatedQuery.value,
    concepts: filterStore.effectiveConcepts,
    assetType: filterStore.filters.assetType,
    limit: filterStore.filters.limit,
  });
}

function resetAll() {
  filterStore.reset();
  queryStore.clearResults();
  selectedAsset.value = null;
}

function toggleAssetSelection(asset: any) {
  selectedAsset.value = selectedAsset.value?.id === asset.id ? null : asset;
}

// ─── Expose ───────────────────────────────────────────────────────────────────

defineExpose({ selectedAsset });
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
