<script setup lang="ts">
import { computed } from "vue";
import type { NodeDatum } from "~/utils/graph/graphTypes";

const props = defineProps<{ node: NodeDatum; degree: number }>();
defineEmits<{ close: [] }>();

const asset = computed(() => props.node.asset);

const pdfLabel = computed(() => {
  if (asset.value.type !== "TechnicalDocument") return null;
  return decodeURIComponent(
    asset.value.pdfUrl.split("/").pop() ?? asset.value.pdfUrl,
  );
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-96"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <h3
        class="font-semibold text-gray-900 dark:text-white text-sm leading-tight break-words"
      >
        {{ asset.name }}
      </h3>
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

    <!-- Type badge -->
    <div class="flex items-center gap-2 mb-4">
      <span
        class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
        :style="{ backgroundColor: node.color }"
      >
        {{ asset.type }}
      </span>
    </div>

    <!-- URI -->
    <div class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        URI
      </p>
      <p
        class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed break-all"
      >
        {{ asset.id }}
      </p>
    </div>

    <!-- rdfs:label -->
    <div class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Label
      </p>
      <p
        v-if="asset.rdfs_label"
        class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
      >
        {{ asset.rdfs_label }}
      </p>
      <p v-else class="text-xs text-gray-400 dark:text-gray-600 italic">
        No label available.
      </p>
    </div>

    <!-- Comment -->
    <div class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Comment
      </p>
      <p
        v-if="asset.comment"
        class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
      >
        {{ asset.comment }}
      </p>
      <p v-else class="text-xs text-gray-400 dark:text-gray-600 italic">
        No description available.
      </p>
    </div>

    <!-- Publisher — Dataset, DataService, Catalog, ScientificPaper -->
    <div
      v-if="
        (asset.type === 'Dataset' ||
          asset.type === 'DataService' ||
          asset.type === 'Catalog') &&
        asset.publisher?.length
      "
      class="mb-4"
    >
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Publisher
      </p>
      <ul
        class="text-xs text-gray-600 dark:text-gray-400 ml-2 list-disc list-inside space-y-1"
      >
        <li v-for="pub in asset.publisher" :key="pub">{{ pub }}</li>
      </ul>
    </div>

    <div
      v-if="asset.type === 'ScientificPaper' && asset.publisher"
      class="mb-4"
    >
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Publisher
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ asset.publisher }}
      </p>
    </div>

    <!-- Location — Dataset, DataService -->
    <div
      v-if="
        (asset.type === 'Dataset' || asset.type === 'DataService') &&
        asset.location?.length
      "
      class="mb-4"
    >
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Location
      </p>
      <ul
        class="text-xs text-gray-600 dark:text-gray-400 ml-2 list-disc list-inside space-y-1"
      >
        <li v-for="loc in asset.location" :key="loc">{{ loc }}</li>
      </ul>
    </div>

    <!-- Issued — Dataset -->
    <div v-if="asset.type === 'Dataset' && asset.issued" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Issued
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">{{ asset.issued }}</p>
    </div>

    <!-- See Also — DataService -->
    <div v-if="asset.type === 'DataService' && asset.seealso" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        See Also
      </p>
      <a
        :href="asset.seealso"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
      >
        {{ asset.seealso }}
      </a>
    </div>

    <!-- Homepage — Catalog -->
    <div v-if="asset.type === 'Catalog' && asset.homepage" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Homepage
      </p>
      <a
        :href="asset.homepage"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
      >
        {{ asset.homepage }}
      </a>
    </div>

    <!-- Author — UserFeedback & TechnicalDocument -->
    <div
      v-if="asset.type === 'UserFeedback' || asset.type === 'TechnicalDocument'"
      class="mb-4"
    >
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        Author
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ asset.author || "—" }}
      </p>
    </div>

    <!-- PDF — TechnicalDocument -->
    <div v-if="asset.type === 'TechnicalDocument' && asset.pdfUrl" class="mb-4">
      <p
        class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
      >
        PDF
      </p>
      <a
        :href="asset.pdfUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
      >
        {{ pdfLabel }}
      </a>
    </div>

    <!-- ScientificPaper specifics -->
    <template v-if="asset.type === 'ScientificPaper'">
      <div v-if="asset.authorID" class="mb-4">
        <p
          class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
        >
          Author ID
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400 break-all">
          {{ asset.authorID }}
        </p>
      </div>

      <div v-if="asset.publication_year" class="mb-4">
        <p
          class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
        >
          Publication Year
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ asset.publication_year }}
        </p>
      </div>

      <div v-if="asset.subject?.length" class="mb-4">
        <p
          class="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 mb-1"
        >
          Subjects
        </p>
        <ul
          class="text-xs text-gray-600 dark:text-gray-400 ml-2 list-disc list-inside space-y-1"
        >
          <li v-for="s in asset.subject" :key="s">{{ s }}</li>
        </ul>
      </div>
    </template>

    <!-- Footer -->
    <div
      class="border-t border-gray-100 dark:border-gray-700 pt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <p><span class="font-medium">Connections:</span> {{ degree }}</p>
    </div>
  </div>
</template>
