<template>
  <div class="space-y-2">
    <label class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Concept
    </label>

    <!-- Concept Category Selector -->
    <div class="relative">
      <select
        v-model="selectedCategory"
        :disabled="disabled"
        class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select a category...</option>
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Specific Concepts (if category selected) -->
    <div v-if="selectedCategory && availableConcepts.length > 0" class="space-y-2 mt-3">
      <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
        Select specific concepts:
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="concept in availableConcepts"
          :key="concept.value"
          @click="toggleConcept(concept.value)"
          type="button"
          class="px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200"
          :class="isSelected(concept.value)
            ? 'border-gold-500 dark:border-gold-400 bg-gold-500 dark:bg-gold-400 text-white'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gold-300 dark:hover:border-gold-600'
          "
        >
          {{ concept.label }}
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      Filter by concepts that the assets represent
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  modelValue: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const selectedCategory = ref('');

const conceptCategories = [
  {
    name: 'activities',
    label: 'Activities',
    concepts: [
      { value: 'Activity', label: 'Activity (General)' },
      { value: 'HumanOutdoorActivities', label: 'Human Outdoor Activities' },
      { value: 'Hiking', label: 'Hiking' },
      { value: 'Skiing', label: 'Skiing' },
      { value: 'Cycling', label: 'Cycling' },
      { value: 'TrailRunning', label: 'Trail Running' }
    ]
  },
  {
    name: 'land',
    label: 'Land Entities',
    concepts: [
      { value: 'LandEntity', label: 'Land Entity (General)' },
      { value: 'Path', label: 'Path' },
      { value: 'Trail', label: 'Trail' },
      { value: 'Area', label: 'Area' },
      { value: 'Footprint', label: 'Footprint' }
    ]
  },
  {
    name: 'species',
    label: 'Species & Population',
    concepts: [
      { value: 'Population', label: 'Population' },
      { value: 'Species', label: 'Species' },
      { value: 'AnimalMovement', label: 'Animal Movement' },
      { value: 'AnimalDisturbance', label: 'Animal Disturbance' }
    ]
  },
  {
    name: 'environment',
    label: 'Environment',
    concepts: [
      { value: 'Habitat', label: 'Habitat' },
      { value: 'Season', label: 'Season' },
      { value: 'Weather', label: 'Weather' },
      { value: 'Topography', label: 'Topography' }
    ]
  }
];

const availableConcepts = computed(() => {
  const category = conceptCategories.find(c => c.name === selectedCategory.value);
  return category?.concepts || [];
});

function isSelected(value: string): boolean {
  return props.modelValue.includes(value);
}

function toggleConcept(value: string) {
  const newValue = isSelected(value)
    ? props.modelValue.filter(v => v !== value)
    : [...props.modelValue, value];
  emit('update:modelValue', newValue);
}

// Reset concepts when category changes
watch(selectedCategory, () => {
  emit('update:modelValue', []);
});
</script>
