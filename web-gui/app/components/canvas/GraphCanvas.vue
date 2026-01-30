<template>
  <div
    class="relative w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <!-- Controls Overlay -->
    <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <!-- Zoom Controls -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          @click="zoomIn"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom in"
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
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          @click="zoomOut"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom out"
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
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          @click="resetView"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Reset view"
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

      <!-- View Options -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          @click="toggleLabels"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': showLabels }"
          title="Toggle labels"
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

    <!-- Info Panel -->
    <div
      v-if="selectedNode"
      class="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
    >
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ selectedNode.label }}
        </h3>
        <button
          @click="selectedNode = null"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
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
      <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span class="font-medium">Connections:</span>
          {{ selectedNode.degree }}
        </p>
        <p><span class="font-medium">Type:</span> {{ selectedNode.type }}</p>
      </div>
    </div>

    <!-- Graph Container -->
    <div ref="graphContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const graphContainer = ref<HTMLDivElement | null>(null);
const showLabels = ref(true);
const selectedNode = ref<any>(null);

let sigma: any = null;
let graph: any = null;

onMounted(async () => {
  const Sigma = (await import("sigma")).default;
  const Graph = (await import("graphology")).default;

  graph = new Graph();

  // Add sample nodes
  graph.addNode("n1", {
    x: 0,
    y: 0,
    size: 10,
    label: "Node 1",
    color: "#3B82F6",
  });
  graph.addNode("n2", {
    x: 1,
    y: 1,
    size: 10,
    label: "Node 2",
    color: "#8B5CF6",
  });
  graph.addEdge("n1", "n2");

  sigma = new Sigma(graph, graphContainer.value!, {
    renderLabels: showLabels.value,
  });

  sigma.on("clickNode", ({ node }: { node: string }) => {
    const nodeData = graph.getNodeAttributes(node);
    selectedNode.value = {
      label: nodeData.label,
      degree: graph.degree(node),
      type: nodeData.type || "Default",
    };
  });
});

onBeforeUnmount(() => {
  if (sigma) {
    sigma.kill();
  }
});

const zoomIn = () => {
  if (sigma) {
    const camera = sigma.getCamera();
    camera.animatedZoom({ duration: 300 });
  }
};

const zoomOut = () => {
  if (sigma) {
    const camera = sigma.getCamera();
    camera.animatedUnzoom({ duration: 300 });
  }
};

const resetView = () => {
  if (sigma) {
    const camera = sigma.getCamera();
    camera.animatedReset({ duration: 500 });
  }
};

const toggleLabels = () => {
  showLabels.value = !showLabels.value;
  if (sigma) {
    sigma.setSetting("renderLabels", showLabels.value);
    sigma.refresh();
  }
};
</script>
