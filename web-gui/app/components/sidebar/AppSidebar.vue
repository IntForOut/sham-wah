<template>
  <aside class="h-full flex bg-white border-r">
    <!-- TABS -->
    <SidebarTabs />

    <!-- PANEL -->
    <transition name="slide">
      <SidebarPanel v-if="ui.sidebarOpen" />
    </transition>
  </aside>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import SidebarTabs from "./SidebarTabs.vue";
import SidebarPanel from "./SidebarPanel.vue";

const ui = useUiStore();
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: width 0.25s ease;
}
</style>
