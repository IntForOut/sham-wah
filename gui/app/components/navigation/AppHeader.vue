<template>
  <header
    class="h-20 border-b bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm"
  >
    <!-- LEFT: APP TITLE & LOGO -->
    <div class="flex items-center gap-3 pl-2">
      <div
        class="w-12 h-12 bg-white border border-gold-400 hover:bg-gray-50 dark:bg-gold-900/20 dark:border-gold-400 dark:hover:bg-gold-900/30 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20"
      >
        <span class="text-white font-bold text-2xl">🐐</span>
      </div>
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
import { useUiStore, type ViewName } from "~/stores/ui";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import LanguageSelector from "./LanguageSelector.vue";
import IconGitHub from "~/components/icons/IconGitHub.vue";

const route = useRoute();
const ui = useUiStore();
const mobileMenuOpen = ref(false);

const navItems: Array<{
  label: string;
  path: string;
  view: ViewName;
}> = [
  { label: "Explore Data", path: "/explore", view: "explore" },
  { label: "Map", path: "/map", view: "map" },
  { label: "UserFeedback", path: "/edit", view: "edit" },
  // { label: "Edit Graph", path: "/edit", view: "edit" },
];

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

function linkClass(view: ViewName) {
  return ui.currentView === view
    ? "bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 border-b-2 border-gold-500"
    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800";
}
</script>
