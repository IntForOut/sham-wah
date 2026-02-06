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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Results Display
      <span class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
        class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer"
      >
        <option value="" disabled>Select a result display...</option>
        <option value="show">Node only</option>
        <option value="find">Nodes + full relationships</option>
        <option value="list">Path to concept node</option>
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
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Choose how you want to retrieve the data
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
