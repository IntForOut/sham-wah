<template>
  <div class="space-y-2">
    <label class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
      Digital Asset Type
      <span class="text-red-500">*</span>
    </label>
    <div class="space-y-2">
      <button
        v-for="resourceType in resourceTypes"
        :key="resourceType.value"
        @click="toggleResourceType(resourceType.value)"
        :disabled="disabled"
        type="button"
        class="w-full px-4 py-3 rounded-lg border text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isSelected(resourceType.value)
          ? 'border-gold-500 dark:border-gold-400 bg-gold-50 dark:bg-gold-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gold-300 dark:hover:border-gold-600 hover:bg-gold-50/50 dark:hover:bg-gold-900/10'
        "
      >
        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
            :class="isSelected(resourceType.value)
              ? 'border-gold-500 dark:border-gold-400 bg-gold-500 dark:bg-gold-400'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            "
          >
            <svg
              v-if="isSelected(resourceType.value)"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1">
            <p
              class="text-sm font-medium mb-0.5 transition-colors"
              :class="isSelected(resourceType.value)
                ? 'text-gold-700 dark:text-gold-300'
                : 'text-gray-900 dark:text-white'
              "
            >
              {{ resourceType.label }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ resourceType.description }}
            </p>
          </div>
        </div>
      </button>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Select one or more resource types (multiple selection available)
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const resourceTypes = [
  {
    value: 'Dataset',
    label: 'Dataset',
    description: 'Observation data, GPS traces, sensor readings'
  },
  {
    value: 'ScientificSurvey',
    label: 'Scientific Survey',
    description: 'Field studies, population surveys, habitat assessments'
  },
  {
    value: 'ScientificPaper',
    label: 'Scientific Paper',
    description: 'Research publications, studies, analyses'
  },
  {
    value: 'Process',
    label: 'Process',
    description: 'Data processing workflows, analysis methods'
  },
  {
    value: 'UserFeedback',
    label: 'User Feedback',
    description: 'Community contributions, annotations, reviews'
  }
];

function isSelected(value: string): boolean {
  return props.modelValue.includes(value);
}

function toggleResourceType(value: string) {
  const newValue = isSelected(value)
    ? props.modelValue.filter(v => v !== value)
    : [...props.modelValue, value];
  emit('update:modelValue', newValue);
}
</script>
