<template>
  <button
    ref="triggerRef"
    class="group relative w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold transition-all duration-200"
    :class="
      active
        ? 'bg-gradient-to-br from-gold-400 via-gold-500 to-bronze-600 text-white shadow-lg'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gold-900/20'
    "
    @click="$emit('select')"
    @mouseenter="updateCoords"
    @mouseleave="isHovered = false"
  >
    <span>{{ tab.icon }}</span>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <span
          v-if="isHovered"
          class="fixed z-[9999] whitespace-nowrap bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl pointer-events-none"
          :style="{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: 'translateY(-50%)',
          }"
        >
          {{ tab.label }}
          <span
            class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"
          ></span>
        </span>
      </Transition>
    </Teleport>
  </button>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const props = defineProps<{
  tab: { id: string; label: string; icon: string };
  active: boolean;
  open: boolean;
}>();

const isHovered = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const coords = reactive({ top: 0, left: 0 });

function updateCoords() {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect();
    coords.top = rect.top + rect.height / 2; // Centré verticalement
    coords.left = rect.right + 10; // 10px à droite du bouton
  }
  isHovered.value = true;
}

defineEmits(["select"]);
</script>
