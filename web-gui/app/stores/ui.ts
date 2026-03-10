import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type ViewName = "explore" | "map" | "edit";
export type SidebarTab = "cypher" | "chatbot" | "human";
export type DisplayMode = "graph" | "table";

export const useUiStore = defineStore("ui", () => {
  // --- STATE ---
  const currentView = ref<ViewName>("explore");
  const sidebarOpen = ref(true);
  const displayMode = ref<DisplayMode>("graph");
  const activeSidebarTab = ref<SidebarTab>("human");

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

  function openSidebar(tab?: SidebarTab) {
    sidebarOpen.value = true;
    if (tab) activeSidebarTab.value = tab;
  }

  function setSidebarTab(tab: SidebarTab) {
    activeSidebarTab.value = tab;
  }

  function setDisplayMode(mode: DisplayMode) {
    displayMode.value = mode;
  }

  return {
    // state
    currentView,
    sidebarOpen,
    displayMode,
    activeSidebarTab,

    // getters
    isSidebarOpen,
    isGraphMode,

    // actions
    setView,
    toggleSidebar,
    setDisplayMode,
    openSidebar,
    setSidebarTab,
  };
});
