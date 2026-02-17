<template>
  <div class="w-96 h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- HEADER -->
    <div
      class="h-16 px-6 border-b dark:border-gray-800 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 via-gold-500 to-bronze-600 flex items-center justify-center shadow-md shadow-gold-500/20"
        >
          <span class="text-white text-sm font-bold">{{ tabIcon }}</span>
        </div>
        <span class="text-base font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </span>
      </div>

      <button
        class="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        @click="ui.toggleSidebar()"
        title="Close sidebar"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- MODE D'AFFICHAGE -->
    <!-- <div
      class="px-6 py-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
    >
      <h3
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
      >
        Mode d'affichage
      </h3>

      <div class="flex gap-2">
        <button
          class="flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200"
          :class="modeClass('graph')"
          @click="ui.setDisplayMode('graph')"
        >
          <div class="flex items-center justify-center gap-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span>Graphe</span>
          </div>
        </button>

        <button
          class="flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200"
          :class="modeClass('table')"
          @click="ui.setDisplayMode('table')"
        >
          <div class="flex items-center justify-center gap-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Tableau</span>
          </div>
        </button>
      </div>
    </div> -->

    <!-- CONTENT -->
    <div class="flex-1 overflow-auto p-6">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUiStore, type DisplayMode } from "@/stores/ui";
import CypherPanel from "./panels/CypherPanel.vue";
import ChatbotPanel from "./panels/ChatbotPanel.vue";
import HumanActivityPanel from "./panels/PredefinedQueryPanel.vue";

const ui = useUiStore();

function modeClass(mode: DisplayMode) {
  return ui.displayMode === mode
    ? "bg-gold-50 dark:bg-gold-900/20 border-gold-500 dark:border-gold-600 text-gold-700 dark:text-gold-400 shadow-sm"
    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50";
}

const panelMap = {
  human: {
    title: "Predefined Query",
    icon: "P",
    component: HumanActivityPanel,
  },
  cypher: {
    title: "Graph Query",
    icon: "G",
    component: CypherPanel,
  },
  chatbot: {
    title: "Chatbot",
    icon: "R",
    component: ChatbotPanel,
  },
};

const title = computed(() => panelMap[ui.activeSidebarTab].title);
const tabIcon = computed(() => panelMap[ui.activeSidebarTab].icon);
const activeComponent = computed(() => panelMap[ui.activeSidebarTab].component);
</script>
