<template>
  <div class="w-14 flex flex-col items-center py-4 gap-2 bg-gray-50 border-r">
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
  { id: "cypher", label: "Query Cypher", icon: "C" },
  { id: "nlq", label: "Langage naturel", icon: "N" },
  { id: "chatbot", label: "Chatbot", icon: "R" },
];

function onSelect(tab: SidebarTab) {
  if (!ui.sidebarOpen) {
    ui.openSidebar(tab);
  } else {
    ui.setSidebarTab(tab);
  }
}
</script>
