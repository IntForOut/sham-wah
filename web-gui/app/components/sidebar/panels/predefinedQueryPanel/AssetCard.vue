<template>
  <button
    @click="$emit('toggle', asset)"
    class="w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150"
    :class="
      selected
        ? 'border-gold-500 dark:border-gold-500 bg-gold-50 dark:bg-gold-900/20 shadow-sm'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-sm'
    "
  >
    <!-- Line 1: Type badge + Name -->
    <div class="flex items-center gap-1.5 min-w-0">
      <span
        class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
        :class="selected ? 'bg-gold-600 text-white' : typeColor"
      >
        {{ shortType }}
      </span>
      <span
        class="text-xs font-semibold truncate"
        :class="
          selected
            ? 'text-gold-900 dark:text-gold-100'
            : 'text-gray-900 dark:text-white'
        "
        :title="asset.name"
      >
        {{ asset.name }}
      </span>
    </div>

    <!-- Line 2: Description (full, wraps naturally) -->
    <p
      v-if="asset.description"
      class="text-[11px] mt-1 leading-relaxed"
      :class="
        selected
          ? 'text-gold-700 dark:text-gold-300'
          : 'text-gray-500 dark:text-gray-400'
      "
    >
      {{ asset.description }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DigitalAsset } from "~/stores/query-result-store";

const props = defineProps<{
  asset: DigitalAsset;
  selected: boolean;
}>();

defineEmits<{ toggle: [asset: DigitalAsset] }>();

const typeColorMap: Record<string, string> = {
  Dataset: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  DataService:
    "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  ScientificPaper:
    "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  ScientificSurvey:
    "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
  Process:
    "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
};

const shortTypeMap: Record<string, string> = {
  Dataset: "Dataset",
  DataService: "Data Service",
  ScientificPaper: "Paper",
  ScientificSurvey: "Survey",
  Process: "Process",
};

const typeColor = computed(
  () =>
    typeColorMap[props.asset.type] ??
    "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
);
const shortType = computed(
  () => shortTypeMap[props.asset.type] ?? props.asset.type,
);
</script>
