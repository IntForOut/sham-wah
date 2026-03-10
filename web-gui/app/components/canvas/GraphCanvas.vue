<template>
  <div
    class="relative w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <!-- ── Toolbar (top-right) ──────────────────────────────────────────── -->
    <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <!-- Zoom controls -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom in"
          @click="zoomIn"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom out"
          @click="zoomOut"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Reset view"
          @click="resetView"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <!-- Label toggle -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': showLabels }"
          title="Toggle labels"
          @click="toggleLabels"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Info panel (top-left, slides in) ─────────────────────────────── -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-2"
    >
      <div v-if="clickedNode" class="absolute top-4 left-4 z-10">
        <GraphInfoPanel
          :node="clickedNode"
          :degree="edgeDegree(clickedNode.id)"
          @close="clickedNode = null"
        />
      </div>
    </Transition>

    <!-- ── Empty state ───────────────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!graphStore.graphNodes.length && !graphStore.isLoadingNeighbors"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none text-gray-300 dark:text-gray-700"
      >
        <svg
          class="w-14 h-14"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
          />
        </svg>
        <p class="text-sm font-medium">
          Select a digital asset to explore its graph
        </p>
      </div>
    </Transition>

    <!-- ── Loading overlay ───────────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="graphStore.isLoadingNeighbors"
        class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-20 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Loading neighbors…
          </p>
        </div>
      </div>
    </Transition>

    <!-- ── Error banner ──────────────────────────────────────────────────── -->
    <div
      v-if="graphStore.error"
      class="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs px-4 py-2 rounded-lg shadow"
    >
      {{ graphStore.error }}
    </div>

    <!-- ── Legend (bottom-left) ──────────────────────────────────────────── -->
    <div
      class="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5 items-center"
    >
      <!-- Grouped circle nodes -->
      <div
        v-for="item in LEGEND_ITEMS"
        :key="item.label"
        class="flex items-center gap-1.5"
      >
        <!-- Rect shape for UserFeedback -->
        <span
          v-if="item.shape === 'rect'"
          class="w-4 h-2.5 rounded-sm flex-shrink-0 border border-gray-400"
          style="background: #ffffff"
        />
        <!-- Circle shape for all others -->
        <span
          v-else
          class="w-2.5 h-2.5 rounded-full flex-shrink-0"
          :style="{ backgroundColor: item.color }"
        />
        <span class="text-xs text-gray-600 dark:text-gray-400">{{
          item.label
        }}</span>
      </div>
    </div>

    <!-- ── D3 mount point ────────────────────────────────────────────────── -->
    <div ref="graphContainer" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGraphStore } from "~/stores/graph-store";
import { useGraphRenderer } from "~/composables/useGraphRenderer";
import { TYPE_COLORS } from "~/utils/graph/graphAdapter";
import GraphInfoPanel from "./GraphInfoPanel.vue";

const LEGEND_ITEMS = [
  { label: "Data", color: TYPE_COLORS.Dataset, shape: "circle" },
  {
    label: "Scientific Paper",
    color: TYPE_COLORS.ScientificPaper,
    shape: "circle",
  },
  { label: "User Feedback", color: TYPE_COLORS.UserFeedback, shape: "rect" },
] as const;

// ── Store ──────────────────────────────────────────────────────────────────────
const graphStore = useGraphStore();

// ── D3 mount target ───────────────────────────────────────────────────────────
const graphContainer = ref<HTMLDivElement | null>(null);

// ── Renderer composable ───────────────────────────────────────────────────────
const { showLabels, clickedNode, zoomIn, zoomOut, resetView, toggleLabels } =
  useGraphRenderer(
    graphContainer,
    computed(() => graphStore.graphNodes),
    computed(() => graphStore.graphEdges),
  );

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Count edges touching a given node (works before and after d3 resolves string ids) */
function edgeDegree(nodeId: string): number {
  return graphStore.graphEdges.filter((l) => {
    const src = typeof l.source === "string" ? l.source : l.source.id;
    const tgt = typeof l.target === "string" ? l.target : l.target.id;
    return src === nodeId || tgt === nodeId;
  }).length;
}
</script>
