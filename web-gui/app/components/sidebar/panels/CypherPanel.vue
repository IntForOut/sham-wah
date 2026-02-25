<template>
  <div class="space-y-6">
    <!-- QUERY SECTION -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Cypher Query
        </h3>
        <button
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          @click="clearQuery"
        >
          Clear
        </button>
      </div>

      <div class="space-y-3">
        <!-- Textarea -->
        <div class="relative">
          <textarea
            v-model="query"
            spellcheck="false"
            placeholder="MATCH (n) RETURN n LIMIT 25"
            rows="6"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-mono focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400 focus:border-transparent transition-all resize-none"
            @keydown.ctrl.enter="executeQuery"
            @keydown.meta.enter="executeQuery"
          />
          <div
            class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500"
          >
            {{ query.length }} characters
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-2">
          <!-- Execute -->
          <button
            :disabled="!query.trim() || queryStore.isExecuting"
            class="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              !query.trim() || queryStore.isExecuting
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                : 'bg-gradient-to-r from-gold-500 via-gold-600 to-bronze-600 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]'
            "
            @click="executeQuery"
          >
            <svg
              v-if="queryStore.isExecuting"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{
              queryStore.isExecuting ? "Executing..." : "Execute"
            }}</span>
          </button>

          <!-- Format -->
          <button
            :disabled="!query.trim()"
            class="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:border-gold-300 dark:hover:border-gold-700 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Format query"
            @click="formatQuery"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Clear results -->
          <button
            :disabled="queryStore.isExecuting || !queryStore.results"
            class="px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              queryStore.isExecuting || !queryStore.results
                ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02] active:scale-[0.98]'
            "
            title="Clear query and results"
            @click="clearQuery"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <!-- Keyboard shortcut hint -->
        <p class="text-xs text-gray-500 dark:text-gray-400">
          <kbd
            class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >Ctrl</kbd
          >
          +
          <kbd
            class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >Enter</kbd
          >
          &nbsp;to execute
        </p>
      </div>
    </section>

    <!-- RESULTS SECTION -->
    <section v-if="queryStore.results || queryStore.error">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Results
      </h3>

      <!-- Error state -->
      <div
        v-if="queryStore.error"
        class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800 dark:text-red-300">
              Execution error
            </p>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1 font-mono">
              {{ queryStore.error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Success state -->
      <div v-else-if="queryStore.results" class="space-y-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ queryStore.results.count }} result(s) ·
          {{ queryStore.results.executionTime }}ms
        </p>
        <!-- Scrollable list — same layout as PredefinedQueryPanel -->
        <div
          class="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin"
        >
          <AssetCard
            v-for="asset in queryStore.results.data"
            :key="asset.id"
            :asset="asset"
            :selected="selectedAsset?.id === asset.id"
            @toggle="toggleAssetSelection"
          />
        </div>
      </div>
    </section>

    <!-- QUICK TEMPLATES SECTION -->
    <section>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Quick Templates
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          v-for="(template, index) in queryTemplates"
          :key="index"
          class="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:border-gold-300 dark:hover:border-gold-700 transition-all duration-200 group"
          @click="loadTemplate(template.query)"
        >
          <div class="flex items-start gap-2">
            <component
              :is="template.icon"
              class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 flex-shrink-0 mt-0.5"
            />
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 dark:text-white mb-0.5 group-hover:text-gold-700 dark:group-hover:text-gold-400 truncate"
              >
                {{ template.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ template.description }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHumanActivitiesStore } from "~/stores/query-result-store";
import AssetCard from "./predefinedQueryPanel/AssetCard.vue";
import IconGitHub from "~/components/icons/IconGitHub.vue";
import IconHiking from "~/components/icons/IconHiking.vue";

// ─── Store ────────────────────────────────────────────────────────────────────

const queryStore = useHumanActivitiesStore();

// ─── Local state ──────────────────────────────────────────────────────────────

const query = ref("");
const selectedAsset = ref<any | null>(null);

// Clear stale results when the query is edited
watch(query, () => {
  queryStore.clearResults();
  selectedAsset.value = null;
});

// ─── Quick templates ──────────────────────────────────────────────────────────

const queryTemplates = [
  {
    title: "Human Activities",
    description: "Datasets representing human outdoor activities",
    icon: IconHiking,
    query:
      "MATCH (asset:Dataset|ScientificSurvey)-[:REPRESENTS]->(concept:HumanOutdoorActivities)\nRETURN asset, concept\nLIMIT 25",
  },
  {
    title: "Scientific Papers",
    description: "Papers about wildlife disturbance",
    icon: IconGitHub,
    query:
      "MATCH (asset:ScientificPaper)-[:REPRESENTS]->(concept:AnimalDisturbance)\nRETURN asset, concept\nLIMIT 25",
  },
  {
    title: "Hiking Data",
    description: "Hiking-related datasets and surveys",
    icon: IconHiking,
    query:
      "MATCH (asset:Dataset|ScientificSurvey)-[:REPRESENTS]->(concept:Hiking)\nRETURN asset, concept\nLIMIT 25",
  },
  {
    title: "All Digital Assets",
    description: "Browse all available resources",
    icon: IconGitHub,
    query:
      "MATCH (asset:Dataset|DataService|ScientificPaper|ScientificSurvey|Process)\nRETURN asset\nLIMIT 25",
  },
  {
    title: "Count by Label",
    description: "Stats — count nodes per label",
    icon: IconGitHub,
    query:
      "MATCH (n)\nRETURN labels(n) AS label, count(*) AS count\nORDER BY count DESC",
  },
  {
    title: "Explore Relationships",
    description: "Show all relationship types in the graph",
    icon: IconGitHub,
    query:
      "MATCH (n)-[r]->(m)\nRETURN type(r) AS relationship, count(*) AS count\nORDER BY count DESC\nLIMIT 25",
  },
];

// ─── Methods ──────────────────────────────────────────────────────────────────

async function executeQuery() {
  if (!query.value.trim() || queryStore.isExecuting) return;
  selectedAsset.value = null;
  await queryStore.executeQuery({
    query: query.value,
    concepts: [],
    assetType: "all",
    limit: 25,
  });
}

function clearQuery() {
  query.value = "";
  queryStore.clearResults();
  selectedAsset.value = null;
}

function formatQuery() {
  if (!query.value.trim()) return;
  const keywords = ["MATCH", "WHERE", "RETURN", "WITH", "ORDER BY", "LIMIT"];
  let formatted = query.value;
  keywords.forEach((keyword) => {
    formatted = formatted.replace(
      new RegExp(`\\s+${keyword}\\s+`, "gi"),
      `\n${keyword} `,
    );
  });
  query.value = formatted.trim();
}

function loadTemplate(templateQuery: string) {
  query.value = templateQuery;
  queryStore.clearResults();
  selectedAsset.value = null;
}

function toggleAssetSelection(asset: any) {
  selectedAsset.value = selectedAsset.value?.id === asset.id ? null : asset;
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
