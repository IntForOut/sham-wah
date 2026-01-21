<template>
  <button
    class="group relative w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold transition-all duration-200"
    :class="
      active
        ? 'bg-gradient-to-br from-gold-400 via-gold-500 to-bronze-600 text-white shadow-lg shadow-gold-500/30'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700 dark:hover:text-gold-400 hover:scale-105'
    "
    @click="$emit('select')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span>{{ tab.icon }}</span>

    <!-- Label tooltip -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <span
        v-if="isHovered && !open"
        class="absolute left-16 whitespace-nowrap bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg z-50"
      >
        {{ tab.label }}
        <span
          class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"
        ></span>
      </span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  tab: { id: string; label: string; icon: string };
  active: boolean;
  open: boolean;
}>();

const isHovered = ref(false);

defineEmits(["select"]);
</script>
