<template>
  <div class="w-80 h-full flex flex-col">
    <!-- HEADER -->
    <div class="h-12 px-4 border-b flex items-center justify-between">
      <span class="text-sm font-semibold">
        {{ title }}
      </span>

      <button
        class="text-gray-400 hover:text-gray-800"
        @click="ui.toggleSidebar()"
      >
        ✕
      </button>
    </div>

    <!-- CONTENT -->

    <!-- MODE D’AFFICHAGE -->

    <div class="flex-1 overflow-auto p-4 space-y-6">
      <section>
        <h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">
          Mode d’affichage
        </h3>

        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 rounded border text-center"
            :class="modeClass('graph')"
            @click="ui.setDisplayMode('graph')"
          >
            Graphe
          </button>

          <button
            class="flex-1 px-3 py-2 rounded border text-center"
            :class="modeClass('table')"
            @click="ui.setDisplayMode('table')"
          >
            Tableau
          </button>
        </div>
      </section>

      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUiStore, type DisplayMode } from "@/stores/ui";
import CypherPanel from "./panels/CypherPanel.vue";
import NLQPanel from "./panels/NLQPanel.vue";
import ChatbotPanel from "./panels/ChatbotPanel.vue";

function modeClass(mode: DisplayMode) {
  return ui.displayMode === mode
    ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium"
    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50";
}

const ui = useUiStore();

const panelMap = {
  cypher: {
    title: "Query Cypher",
    component: CypherPanel,
  },
  nlq: {
    title: "Langage naturel",
    component: NLQPanel,
  },
  chatbot: {
    title: "Chatbot",
    component: ChatbotPanel,
  },
};

const title = computed(() => panelMap[ui.activeSidebarTab].title);
const activeComponent = computed(() => panelMap[ui.activeSidebarTab].component);
</script>
