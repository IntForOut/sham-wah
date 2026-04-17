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

        <ClientOnly>
          <button
            :disabled="
              queryStore.isExecuting || !filterStore.hasCategorySelected
            "
            class="shrink-0 px-3 flex items-center justify-center border-l border-gray-200 dark:border-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            :class="
              queryStore.isExecuting || !filterStore.hasCategorySelected
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

          <template #fallback>
            <button
              disabled
              class="shrink-0 px-3 bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-40 cursor-not-allowed ..."
              title="Search"
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
          </template>
        </ClientOnly>
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

    <!-- Max results — outside filters, controls result count -->
    <div class="flex items-center gap-2">
      <label
        for="results-limit"
        class="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0"
      >
        Max results
      </label>
      <select
        id="results-limit"
        :value="filterStore.filters.limit"
        :disabled="queryStore.isExecuting"
        class="w-24 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all disabled:opacity-50"
        @change="
          filterStore.setFilters({
            limit: Number(($event.target as HTMLSelectElement).value),
          })
        "
      >
        <option v-for="n in [10, 15, 25, 50, 100]" :key="n" :value="n">
          {{ n }}
        </option>
      </select>
    </div>

    <!-- Results section -->
    <section v-if="queryStore.results || queryStore.error">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Results
          <span
            v-if="queryStore.results"
            class="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500"
          >
            ({{ queryStore.results.count }})
          </span>
        </h3>
        <button
          class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Clear results"
          @click="clearResults"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      </div>
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
      <div v-else-if="queryStore.results" class="space-y-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ queryStore.results.executionTime }}ms
        </p>
        <!-- Scrollable list capped before scrolling -->
        <div
          class="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin"
        >
          <AssetCard
            v-for="asset in queryStore.results.data"
            :key="asset.id"
            :asset="asset"
            :selected="selectedAsset?.id === asset.id"
            @toggle="toggleAssetSelection"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHumanActivitiesStore } from "~/stores/query-result-store";
import { usePredefinedQueryStore } from "~/stores/predefined-query-store";
import { useGraphStore } from "~/stores/graph-store";
import AppAccordion from "~/components/sidebar/panels/AppAccordion.vue";
import ConceptSelector from "./predefinedQueryPanel/ConceptSelector.vue";
import QueryFilters from "./predefinedQueryPanel/QueryFilters.vue";
import AssetCard from "./predefinedQueryPanel/AssetCard.vue";
import { storeToRefs } from "pinia";

const queryStore = useHumanActivitiesStore();
const filterStore = usePredefinedQueryStore();
const graphStore = useGraphStore();

const { selectedAsset } = storeToRefs(graphStore);

async function executeQuery() {
  if (!filterStore.hasCategorySelected) return;
  graphStore.clearGraph();
  await queryStore.executeQueryMockData({
    concepts: filterStore.effectiveConcepts,
    assetType: filterStore.filters.assetType,
    limit: filterStore.filters.limit,
  });
}

function clearResults() {
  queryStore.clearResults();
  graphStore.clearGraph();
}

function resetAll() {
  filterStore.reset();
  queryStore.clearResults();
  graphStore.clearGraph();
}

function toggleAssetSelection(asset: DigitalAsset) {
  if (selectedAsset.value?.id === asset.id) {
    graphStore.clearGraph();
  } else {
    graphStore.selectAsset(asset);
  }
}

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
