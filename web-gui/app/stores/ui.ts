import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type ViewName = "explore" | "map" | "resources" | "edit";
export type DisplayMode = "graph" | "table";

export const useUiStore = defineStore("ui", () => {
  // --- STATE ---
  const currentView = ref<ViewName>("explore");
  const sidebarOpen = ref(true);
  const displayMode = ref<DisplayMode>("graph");

  // --- GETTERS ---
  const isSidebarOpen = computed(() => sidebarOpen.value);
  const isGraphMode = computed(() => displayMode.value === "graph");

  // --- ACTIONS ---
  function setView(view: ViewName) {
    currentView.value = view;
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setDisplayMode(mode: DisplayMode) {
    displayMode.value = mode;
  }

  return {
    // state
    currentView,
    sidebarOpen,
    displayMode,

    // getters
    isSidebarOpen,
    isGraphMode,

    // actions
    setView,
    toggleSidebar,
    setDisplayMode,
  };
});
