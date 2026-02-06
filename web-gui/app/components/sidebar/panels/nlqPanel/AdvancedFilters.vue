<template>
  <div class="space-y-3">
    <button
      @click="isExpanded = !isExpanded"
      type="button"
      class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Advanced Filters
      </span>
      <svg
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-show="isExpanded"
      class="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
    >
      <!-- Limit -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <span>Result Limit</span>
          <span class="text-gold-600 dark:text-gold-400">{{ localFilters.limit }}</span>
        </label>
        <input
          v-model.number="localFilters.limit"
          type="range"
          min="1"
          max="100"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
        />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>1</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <!-- Order By -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
          Order By
        </label>
        <div class="relative">
          <select
            v-model="localFilters.orderBy"
            class="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="">No ordering</option>
            <option value="asset.name ASC">Name (A-Z)</option>
            <option value="asset.name DESC">Name (Z-A)</option>
            <option value="asset.createdAt DESC">Newest First</option>
            <option value="asset.createdAt ASC">Oldest First</option>
            <option value="asset.updatedAt DESC">Recently Updated</option>
          </select>
          <svg
            class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Custom WHERE Clause -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          Custom WHERE Clause
          <span class="text-gray-400 dark:text-gray-500">(advanced)</span>
        </label>
        <textarea
          v-model="localFilters.whereClause"
          placeholder="e.g., asset.year > 2020 AND asset.region = 'Alps'"
          rows="2"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs font-mono focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all resize-none"
        ></textarea>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Add custom Cypher WHERE conditions
        </p>
      </div>

      <!-- Apply/Reset Buttons -->
      <div class="flex gap-2 pt-2">
        <button
          @click="applyFilters"
          type="button"
          class="flex-1 px-3 py-2 rounded-lg bg-gold-500 dark:bg-gold-600 text-white text-xs font-medium hover:bg-gold-600 dark:hover:bg-gold-500 transition-colors"
        >
          Apply Filters
        </button>
        <button
          @click="resetFilters"
          type="button"
          class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: {
    limit: number;
    orderBy: string;
    whereClause: string;
  };
}>();

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue];
}>();

const isExpanded = ref(false);
const localFilters = ref({ ...props.modelValue });

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue };
}, { deep: true });

function applyFilters() {
  emit('update:modelValue', { ...localFilters.value });
}

function resetFilters() {
  localFilters.value = {
    limit: 25,
    orderBy: '',
    whereClause: ''
  };
  emit('update:modelValue', { ...localFilters.value });
}
</script>
