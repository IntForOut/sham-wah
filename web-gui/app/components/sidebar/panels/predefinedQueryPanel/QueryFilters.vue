<template>
  <div class="space-y-3">
    <!-- Limit + Resource type -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label
          class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
        >
          Limit
        </label>
        <input
          :value="store.filters.limit"
          type="number"
          min="1"
          max="100"
          :disabled="isExecuting"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all disabled:opacity-50"
          @change="
            store.setFilters({
              limit: Number(($event.target as HTMLInputElement).value),
            })
          "
        />
      </div>
      <div>
        <label
          class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
        >
          Resource Type
        </label>
        <select
          :value="store.filters.assetType"
          :disabled="isExecuting"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all disabled:opacity-50"
          @change="
            store.setFilters({
              assetType: ($event.target as HTMLSelectElement).value,
            })
          "
        >
          <option
            v-for="type in ASSET_TYPES"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Specific concepts (only visible when a category is selected) -->
    <Transition name="fade-slide">
      <div
        v-if="store.hasCategorySelected && store.availableConcepts.length > 0"
        class="space-y-2 p-3 rounded-lg bg-gold-50/50 dark:bg-gold-900/10 border border-gold-200/50 dark:border-gold-800/30"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
              Specific concepts
            </p>
            <span
              class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
            >
              Optional
            </span>
          </div>
          <button
            v-if="store.selectedConceptValues.length > 0"
            class="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors"
            @click="store.clearConcepts()"
          >
            Clear ({{ store.selectedConceptValues.length }})
          </button>
        </div>

        <!-- Hint -->
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Leave empty to search all
          {{ store.selectedCategory?.label.toLowerCase() }} concepts
        </p>

        <!-- Concept toggle buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="concept in store.availableConcepts"
            :key="concept.value"
            type="button"
            class="px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200"
            :class="
              store.selectedConceptValues.includes(concept.value)
                ? 'border-gold-500 dark:border-gold-400 bg-gold-500 dark:bg-gold-400 text-white shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gold-300 dark:hover:border-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20'
            "
            @click="store.toggleConcept(concept.value)"
          >
            {{ concept.label }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Search + Reset buttons -->
    <div class="flex gap-2 pt-1">
      <!-- Search -->
      <button
        :disabled="isExecuting || !store.hasCategorySelected"
        class="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          isExecuting
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            : 'bg-gradient-to-r from-gold-500 via-gold-600 to-bronze-600 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]'
        "
        @click="emit('search')"
      >
        <svg
          v-if="isExecuting"
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
        <span>{{ isExecuting ? "Searching..." : "Search" }}</span>
      </button>

      <!-- Reset -->
      <button
        :disabled="isExecuting"
        class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02] active:scale-[0.98]"
        title="Reset filters and results"
        @click="emit('reset')"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Reset</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  usePredefinedQueryStore,
  ASSET_TYPES,
} from "~/stores/predefined-query-store";

defineProps<{ isExecuting: boolean }>();

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

const store = usePredefinedQueryStore();
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
