<template>
  <aside
    class="h-full flex bg-white dark:bg-gray-900 border-r dark:border-gray-800 shadow-sm"
  >
    <!-- TABS -->
    <SidebarTabs />

    <!-- PANEL -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
    >
      <SidebarPanel v-if="ui.sidebarOpen" />
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import SidebarTabs from "./SidebarTabs.vue";
import SidebarPanel from "./SidebarPanel.vue";

const ui = useUiStore();
</script>
