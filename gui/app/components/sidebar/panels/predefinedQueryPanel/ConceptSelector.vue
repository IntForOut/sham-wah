<template>
  <div class="relative">
    <select
      v-model="selectedCategory"
      :disabled="disabled"
      class="w-full h-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
    >
      <option value="">Select a concept category...</option>
      <option
        v-for="category in CONCEPT_CATEGORIES"
        :key="category.name"
        :value="category.name"
      >
        {{ category.label }}
      </option>
    </select>

    <!-- Chevron icon -->
    <svg
      class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  usePredefinedQueryStore,
  CONCEPT_CATEGORIES,
} from "~/stores/predefined-query-store";

defineProps<{ disabled?: boolean }>();

const store = usePredefinedQueryStore();

const selectedCategory = computed({
  get: () => store.selectedCategoryName,
  set: (value: string) => store.setCategory(value),
});
</script>
