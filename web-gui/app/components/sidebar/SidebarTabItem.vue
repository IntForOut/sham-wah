<template>
  <button
    class="group relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition"
    :class="
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-500 hover:bg-gray-200'
    "
    @click="$emit('select')"
  >
    <span>{{ tab.icon }}</span>

    <!-- Label tooltip quand fermé -->
    <span
      v-if="!open"
      class="absolute left-12 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
    >
      {{ tab.label }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  tab: { id: string; label: string; icon: string };
  active: boolean;
  open: boolean;
}>();

defineEmits(["select"]);
</script>
