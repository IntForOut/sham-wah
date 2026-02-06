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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      Relationship
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
        :disabled="disabled"
        class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">No relationship filter (optional)</option>
        <option value="represents">Represents</option>
        <option value="describes">Describes</option>
        <option value="observes">Observes</option>
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
      How the digital asset relates to a concept (optional)
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
