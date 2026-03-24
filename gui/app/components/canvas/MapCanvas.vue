<template>
  <div
    class="relative w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <!-- Controls Overlay -->
    <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <!-- Navigation Controls -->
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
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      <!-- Map Style Controls -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          @click="toggleStyle"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Toggle map style"
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="absolute top-4 left-4 z-10 w-80">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search location..."
          class="w-full px-4 py-2.5 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="searchLocation"
        />
        <svg
          class="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Location Info Panel -->
    <div
      v-if="selectedLocation"
      class="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
    >
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ selectedLocation.name }}
        </h3>
        <button
          @click="selectedLocation = null"
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
          <span class="font-medium">Coordinates:</span>
          {{ selectedLocation.coordinates }}
        </p>
        <p v-if="selectedLocation.description">
          {{ selectedLocation.description }}
        </p>
      </div>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    >
      <div class="text-center">
        <div
          class="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"
        ></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import maplibregl from "maplibre-gl";

const mapContainer = ref<HTMLDivElement | null>(null);
const loading = ref(true);
const searchQuery = ref("");
const selectedLocation = ref<any>(null);
const currentStyle = ref("streets");

const config = useRuntimeConfig();
const key = config.public.MAPTILER_KEY;

let map: any = null;

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value!,
    style: `https://api.maptiler.com/maps/aquarelle-v4/style.json?key=${key}`,
    center: [2.3488, 48.8534],
    zoom: 5,
  });

  map.on("load", () => {
    loading.value = false;
  });

  map.on("click", (e: any) => {
    selectedLocation.value = {
      name: "Selected Location",
      coordinates: `${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`,
      description: "Click on the map to explore",
    };
  });

  // Simulate loading
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});

const zoomIn = () => {
  if (map) {
    map.zoomIn({ duration: 300 });
  }
};

const zoomOut = () => {
  if (map) {
    map.zoomOut({ duration: 300 });
  }
};

const resetView = () => {
  if (map) {
    map.flyTo({
      center: [2.3488, 48.8534],
      zoom: 4,
      duration: 1000,
    });
  }
};

const toggleStyle = () => {
  currentStyle.value =
    currentStyle.value === "streets" ? "satellite" : "streets";
};

const searchLocation = () => {
  // Implement location search
  console.log("Searching for:", searchQuery.value);
};
</script>
