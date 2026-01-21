<template>
  <header
    class="h-20 border-b bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm"
  >
    <!-- LEFT: APP TITLE & LOGO -->
    <div class="flex items-center gap-2 pl-4">
      <span
        class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Sham-Wah
      </span>
    </div>

    <!-- CENTER: NAVIGATION -->
    <nav class="hidden md:flex items-center gap-4">
      <NuxtLink
        v-for="item in navItems"
        :key="item.view"
        :to="item.path"
        class="px-4 py-2 rounded-lg text-md font-medium transition-all duration-200"
        :class="linkClass(item.view)"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- RIGHT: ACTIONS -->
    <div class="flex items-center gap-6">
      <ThemeSwitcher />
      <LanguageSelector />
      <a
        href="https://github.com/vpech77"
        target="_blank"
        rel="noopener noreferrer"
        class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        title="View on GitHub"
      >
        <IconGitHub class="w-8 h-8" />
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUiStore, type ViewName } from "@/stores/ui";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import LanguageSelector from "./LanguageSelector.vue";
import IconGitHub from "@/components/icons/IconGitHub.vue";

const route = useRoute();
const ui = useUiStore();
const mobileMenuOpen = ref(false);

/**
 * Navigation configuration
 */
const navItems: Array<{
  label: string;
  path: string;
  view: ViewName;
}> = [
  { label: "Exploration", path: "/explore", view: "explore" },
  { label: "Carte", path: "/map", view: "map" },
  { label: "Ressources", path: "/resources", view: "resources" },
  { label: "Édition", path: "/edit", view: "edit" },
];

/**
 * Sync route -> UI store
 */
watch(
  () => route.path,
  (path) => {
    const match = navItems.find((item) => path.startsWith(item.path));
    if (match) {
      ui.setView(match.view);
    }
    mobileMenuOpen.value = false;
  },
  { immediate: true },
);

/**
 * Dynamic classes
 */
function linkClass(view: ViewName) {
  return ui.currentView === view
    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800";
}
</script>
