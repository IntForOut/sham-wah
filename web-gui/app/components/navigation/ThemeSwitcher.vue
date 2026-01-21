<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="scale-0 rotate-90"
      enter-to-class="scale-100 rotate-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="scale-100 rotate-0"
      leave-to-class="scale-0 -rotate-90"
    >
      <IconSun v-if="isDark" key="sun" class="w-6 h-6" />
      <IconMoon v-else key="moon" class="w-6 h-6" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import IconSun from "@/components/icons/IconSun.vue";
import IconMoon from "@/components/icons/IconMoon.vue";

const isDark = ref(false);

onMounted(() => {
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  isDark.value = savedTheme === "dark" || (!savedTheme && prefersDark);
  applyTheme();
});

function toggleTheme() {
  isDark.value = !isDark.value;
  applyTheme();
}

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}
</script>
