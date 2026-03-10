<template>
  <div
    class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <!-- Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <slot name="icon" />
        <span
          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          <slot name="title" />
        </span>
      </div>
      <svg
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
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
    </button>

    <!-- Content -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[800px]"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-[800px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="border-t border-gray-200 dark:border-gray-700">
        <div class="p-4">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{ defaultOpen?: boolean }>(), {
  defaultOpen: false,
});

const isOpen = ref(props.defaultOpen);
</script>
