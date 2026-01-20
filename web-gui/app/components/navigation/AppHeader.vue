<template>
  <header class="h-14 border-b bg-white flex items-center justify-between px-6">
    <!-- LEFT: APP TITLE -->
    <div class="flex items-center gap-2">
      <span class="text-lg font-semibold text-gray-900"> Sham-Wah </span>
    </div>

    <!-- RIGHT: NAV + ACTIONS -->
    <div class="flex items-center gap-6">
      <!-- Navigation -->
      <nav class="flex items-center gap-4 text-sm">
        <NuxtLink
          v-for="item in navItems"
          :key="item.view"
          :to="item.path"
          class="transition"
          :class="linkClass(item.view)"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3 border-l pl-4">
        <button class="text-gray-500 hover:text-gray-900" title="Switch theme">
          🌙
        </button>

        <button
          class="text-gray-500 hover:text-gray-900"
          title="Change language"
        >
          🌐
        </button>

        <a
          href="https://github.com/your-org/sham-wah"
          target="_blank"
          class="text-gray-500 hover:text-gray-900"
          title="GitHub repository"
        >
          ⎈
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useUiStore, type ViewName } from "@/stores/ui";

const route = useRoute();
const ui = useUiStore();

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
  },
  { immediate: true },
);

/**
 * Dynamic classes
 */
function linkClass(view: ViewName) {
  return ui.currentView === view
    ? "font-semibold text-indigo-600"
    : "text-gray-600 hover:text-gray-900";
}
</script>
