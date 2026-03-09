<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-72"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <div class="flex items-center gap-2 min-w-0">
        <h3
          class="font-semibold text-gray-900 dark:text-white text-sm leading-tight break-words"
        >
          {{ node.label }}
        </h3>
      </div>
      <button
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 transition-colors"
        @click="$emit('close')"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Type badge + selected indicator on the same line -->
    <div class="flex items-center gap-2 mb-4">
      <span
        class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
        :style="{ backgroundColor: node.color }"
      >
        {{ node.type }}
      </span>
    </div>

    <!-- Comment -->
    <div class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Comment
      </p>
      <p
        v-if="hasComment"
        class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
      >
        {{ node.description }}
      </p>
      <p v-else class="text-xs text-gray-400 dark:text-gray-600 italic">
        No description available.
      </p>
    </div>

    <!-- Publisher -->
    <div v-if="node.publisher" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Publisher
      </p>
      <div class="flex items-start gap-1.5">
        <svg
          class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ node.publisher }}
        </p>
      </div>
    </div>

    <!-- Location -->
    <div v-if="node.location?.length" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Location
      </p>

      <ul
        class="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-2 list-disc list-inside"
      >
        <li v-for="loc in node.location" :key="loc">{{ loc }}</li>
      </ul>
    </div>

    <!-- Concepts -->
    <!-- <div v-if="node.concepts?.length" class="mb-4">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="concept in node.concepts"
          :key="concept"
          class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
        >
          {{ concept }}
        </span>
      </div>
    </div> -->

    <!-- Stats -->
    <div
      class="border-t border-gray-100 dark:border-gray-700 pt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <p><span class="font-medium">Connections:</span> {{ degree }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { NodeDatum } from "~/utils/graph/graphTypes";

const props = defineProps<{ node: NodeDatum; degree: number }>();
defineEmits<{ close: [] }>();

const hasComment = computed(
  () =>
    props.node.description &&
    !props.node.description.toLowerCase().includes("no description"),
);
</script>
