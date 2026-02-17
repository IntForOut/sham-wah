<template>
  <div
    class="w-20 flex flex-col items-center py-6 gap-3 bg-gray-50 dark:bg-gray-800/50 border-r dark:border-gray-800"
  >
    <SidebarTabItem
      v-for="tab in tabs"
      :key="tab.id"
      :tab="tab"
      :active="ui.activeSidebarTab === tab.id"
      :open="ui.sidebarOpen"
      @select="onSelect(tab.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useUiStore, type SidebarTab } from "@/stores/ui";
import SidebarTabItem from "./SidebarTabItem.vue";

const ui = useUiStore();

const tabs: Array<{
  id: SidebarTab;
  label: string;
  icon: string;
}> = [
  { id: "human", label: "Predefined Query", icon: "P" },
  { id: "cypher", label: "Graph Query", icon: "G" },
  { id: "chatbot", label: "Chatbot", icon: "R" },
];

function onSelect(tab: SidebarTab) {
  if (!ui.sidebarOpen) return ui.openSidebar(tab);
  if (ui.activeSidebarTab === tab) return ui.toggleSidebar();
  ui.setSidebarTab(tab);
}
</script>
