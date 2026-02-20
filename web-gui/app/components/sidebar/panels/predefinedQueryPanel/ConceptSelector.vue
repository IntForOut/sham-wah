<template>
  <div class="space-y-2">
    <label
      class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      Concept category
    </label>

    <!-- Concept Category Selector -->
    <div class="relative">
      <select
        v-model="selectedCategory"
        :disabled="disabled"
        class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select a concept category...</option>
        <option
          v-for="category in conceptCategories"
          :key="category.name"
          :value="category.name"
        >
          {{ category.label }}
        </option>
      </select>
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

    <!-- Specific Concepts (if category selected) -->
    <!-- <div
      v-if="selectedCategory && availableConcepts.length > 0"
      class="space-y-2 mt-3 p-3 rounded-lg bg-gold-50/50 dark:bg-gold-900/10 border border-gold-200/50 dark:border-gold-800/30"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
            Select specific concepts
          </p>
          <span
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
          >
            Optional
          </span>
        </div>
        <button
          v-if="modelValue.length > 0"
          @click="clearSpecificConcepts"
          class="text-xs text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors"
        >
          Clear ({{ modelValue.length }})
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Leave empty to search all
        {{
          conceptCategories
            .find((c) => c.name === selectedCategory)
            ?.label.toLowerCase()
        }}
        concepts
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="concept in availableConcepts"
          :key="concept.value"
          @click="toggleConcept(concept.value)"
          type="button"
          class="px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200"
          :class="
            isSelected(concept.value)
              ? 'border-gold-500 dark:border-gold-400 bg-gold-500 dark:bg-gold-400 text-white shadow-sm'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gold-300 dark:hover:border-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20'
          "
        >
          {{ concept.label }}
        </button>
      </div>
    </div> -->

    <p class="text-xs text-gray-500 dark:text-gray-400">
      Filter by concepts that the assets represent
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const selectedCategory = ref("");

const conceptCategories = [
  {
    name: "humanActivity",
    label: "Human Activity",
    concepts: [
      { value: "Hiking", label: "Hiking" },
      { value: "Camping", label: "Camping" },
      { value: "Climbing", label: "Climbing" },
      { value: "Skiing", label: "Skiing" },
      { value: "MontainBiking", label: "Montain Biking" },
      { value: "Trekking", label: "Trekking" },
    ],
  },
  {
    name: "animalActivity",
    label: "Animal Activity",
    concepts: [
      { value: "Hiking", label: "Hiking" },
      { value: "Skiing", label: "Skiing" },
      { value: "Cycling", label: "Cycling" },
      { value: "TrailRunning", label: "Trail Running" },
    ],
  },
  {
    name: "land",
    label: "Land Entities",
    concepts: [
      { value: "SensitiveArea", label: "Sensitive Area" },
      { value: "WaterArea", label: "Water Area" },
      { value: "RestArea", label: "Rest Area" },
      { value: "MotorhomeArea", label: "Motorhome Area" },
      { value: "Landmark", label: "Landmark" },
      { value: "Trail", label: "Trail" },
      { value: "NatureReserves", label: "Nature Reserves" },
      { value: "Footprint", label: "Footprint" },
    ],
  },
];

const availableConcepts = computed(() => {
  const category = conceptCategories.find(
    (c) => c.name === selectedCategory.value,
  );
  return category?.concepts || [];
});

// Computed: Get all concept values when category selected but no specific concepts
const effectiveConcepts = computed(() => {
  if (props.modelValue.length > 0) {
    // User selected specific concepts
    return props.modelValue;
  } else if (selectedCategory.value) {
    // Category selected but no specific concepts - return all concepts from category
    return availableConcepts.value.map((c) => c.value);
  }
  return [];
});

function isSelected(value: string): boolean {
  return props.modelValue.includes(value);
}

function toggleConcept(value: string) {
  const newValue = isSelected(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", newValue);
}

function clearSpecificConcepts() {
  emit("update:modelValue", []);
}

// Reset concepts when category changes
watch(selectedCategory, () => {
  emit("update:modelValue", []);
});

// Expose selected category for parent if needed
defineExpose({
  selectedCategory,
  effectiveConcepts,
});
</script>
