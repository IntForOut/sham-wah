<template>
  <div class="space-y-6">
    <!-- QUERY BUILDER SECTION -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Query Builder
        </h3>
        <button
          @click="resetQuery"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <div class="space-y-4">
        <!-- ACTION SELECTOR -->
        <QueryActionSelector
          v-model="queryBuilder.action"
          @update:modelValue="onActionChange"
        />

        <!-- RESOURCE TYPE SELECTOR -->
        <ResourceTypeSelector
          v-model="queryBuilder.resourceTypes"
          :disabled="!queryBuilder.action"
        />

        <!-- RELATIONSHIP SELECTOR -->
        <RelationshipSelector
          v-model="queryBuilder.relationship"
          :disabled="!queryBuilder.resourceTypes.length"
        />

        <!-- CONCEPT SELECTOR -->
        <ConceptSelector
          v-model="queryBuilder.concepts"
          :disabled="!queryBuilder.relationship"
        />

        <!-- ADVANCED FILTERS (Collapsible) -->
        <AdvancedFilters
          v-if="queryBuilder.relationship"
          v-model="queryBuilder.filters"
        />
      </div>
    </section>

    <!-- GENERATED QUERY PREVIEW -->
    <section v-if="generatedQuery">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Generated Cypher Query
        </h3>
        <button
          @click="copyQuery"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>

      <div class="relative">
        <pre
          class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-mono overflow-x-auto"
        ><code>{{ generatedQuery }}</code></pre>
      </div>
    </section>

    <!-- EXECUTE BUTTON -->
    <section v-if="generatedQuery">
      <button
        @click="executeQuery"
        :disabled="isExecuting"
        class="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          isExecuting
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            : 'bg-gradient-to-r from-gold-500 via-gold-600 to-bronze-600 text-white hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]'
        "
      >
        <svg
          v-if="isExecuting"
          class="w-5 h-5 animate-spin"
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
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else
          class="w-5 h-5"
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
        <span>{{ isExecuting ? "Executing..." : "Execute Query" }}</span>
      </button>
    </section>

    <!-- RESULTS SECTION -->
    <section v-if="results || error">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Results
      </h3>

      <!-- ERROR STATE -->
      <div
        v-if="error"
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
              Execution Error
            </p>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1 font-mono">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else-if="results" class="space-y-3">
        <div
          class="p-4 rounded-lg bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-sage-600 dark:text-sage-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-sage-800 dark:text-sage-300">
                Query executed successfully
              </p>
              <p class="text-sm text-sage-700 dark:text-sage-400 mt-1">
                {{ results.count }} result(s) found in
                {{ results.executionTime }}ms
              </p>
            </div>
          </div>
        </div>

        <!-- Results Data Preview -->
        <ResultsTable :data="results.data" />
      </div>
    </section>

    <!-- QUICK TEMPLATES -->
    <section>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Quick Templates
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          v-for="(template, index) in queryTemplates"
          :key="index"
          @click="loadTemplate(template)"
          class="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:border-gold-300 dark:hover:border-gold-700 transition-all duration-200 group"
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
import { ref, computed, watch } from "vue";
import QueryActionSelector from "./nlqPanel/QueryActionSelector.vue";
import ResourceTypeSelector from "./nlqPanel/ResourceTypeSelector.vue";
import RelationshipSelector from "./nlqPanel/RelationshipSelector.vue";
import ConceptSelector from "./nlqPanel/ConceptSelector.vue";
import AdvancedFilters from "./nlqPanel/AdvancedFilters.vue";
import ResultsTable from "./nlqPanel/ResultsTable.vue";
import IconGitHub from "~/components/icons/IconGitHub.vue";
import IconHiking from "~/components/icons/IconHiking.vue";

// Query builder state
const queryBuilder = ref({
  action: "",
  resourceTypes: [] as string[],
  relationship: "",
  concepts: [] as string[],
  filters: {
    limit: 25,
    orderBy: "",
    whereClause: "",
  },
});

// Execution state
const isExecuting = ref(false);
const results = ref<{
  count: number;
  executionTime: number;
  data: any[];
} | null>(null);
const error = ref<string | null>(null);
const copied = ref(false);

// Query templates
const queryTemplates = [
  {
    title: "Human Activities",
    description: "Find datasets representing human outdoor activities",
    icon: IconGitHub,
    config: {
      action: "display",
      resourceTypes: ["Dataset"],
      relationship: "represents",
      concepts: ["HumanOutdoorActivities"],
    },
  },
  {
    title: "Scientific Papers",
    description: "Show papers about wildlife disturbance",
    icon: IconGitHub,
    config: {
      action: "show",
      resourceTypes: ["ScientificPaper"],
      relationship: "describes",
      concepts: ["AnimalDisturbance"],
    },
  },
  {
    title: "Hiking Data",
    description: "Display hiking-related datasets",
    icon: IconHiking,
    config: {
      action: "display",
      resourceTypes: ["Dataset", "ScientificSurvey"],
      relationship: "represents",
      concepts: ["Hiking"],
    },
  },
  {
    title: "All Digital Assets",
    description: "Browse all available resources",
    icon: IconGitHub,
    config: {
      action: "display",
      resourceTypes: ["Dataset", "ScientificPaper", "ScientificSurvey"],
      relationship: "",
      concepts: [],
    },
  },
];

// Generate Cypher query based on builder state
const generatedQuery = computed(() => {
  if (
    !queryBuilder.value.action ||
    queryBuilder.value.resourceTypes.length === 0
  ) {
    return "";
  }

  let query = "MATCH ";

  // Build node pattern
  const resourceTypeLabels = queryBuilder.value.resourceTypes.join("|");
  query += `(asset:${resourceTypeLabels})`;

  // Add relationship and concept if specified
  if (
    queryBuilder.value.relationship &&
    queryBuilder.value.concepts.length > 0
  ) {
    const conceptLabels = queryBuilder.value.concepts.join("|");
    query += `-[:${queryBuilder.value.relationship.toUpperCase()}]->(concept:${conceptLabels})`;
  }

  query += "\n";

  // Add WHERE clause if specified
  if (queryBuilder.value.filters.whereClause) {
    query += `WHERE ${queryBuilder.value.filters.whereClause}\n`;
  }

  // Return clause
  if (
    queryBuilder.value.relationship &&
    queryBuilder.value.concepts.length > 0
  ) {
    query += "RETURN asset, concept";
  } else {
    query += "RETURN asset";
  }

  // Add ORDER BY if specified
  if (queryBuilder.value.filters.orderBy) {
    query += `\nORDER BY ${queryBuilder.value.filters.orderBy}`;
  }

  // Add LIMIT
  query += `\nLIMIT ${queryBuilder.value.filters.limit}`;

  return query;
});

// Watch for changes in query builder to auto-update
watch(
  queryBuilder,
  () => {
    results.value = null;
    error.value = null;
  },
  { deep: true },
);

// Functions
function onActionChange() {
  // Reset dependent fields when action changes
  queryBuilder.value.resourceTypes = [];
  queryBuilder.value.relationship = "";
  queryBuilder.value.concepts = [];
}

function resetQuery() {
  queryBuilder.value = {
    action: "",
    resourceTypes: [],
    relationship: "",
    concepts: [],
    filters: {
      limit: 25,
      orderBy: "",
      whereClause: "",
    },
  };
  results.value = null;
  error.value = null;
}

async function copyQuery() {
  if (!generatedQuery.value) return;

  try {
    await navigator.clipboard.writeText(generatedQuery.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

async function executeQuery() {
  if (!generatedQuery.value || isExecuting.value) return;

  isExecuting.value = true;
  error.value = null;
  results.value = null;

  try {
    // TODO: Replace with actual Neo4j API call
    // const response = await fetch('/api/neo4j/query', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query: generatedQuery.value })
    // });
    // const data = await response.json();

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    const mockData = generateMockResults();
    results.value = {
      count: mockData.length,
      executionTime: Math.floor(Math.random() * 500),
      data: mockData,
    };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    isExecuting.value = false;
  }
}

function generateMockResults() {
  const count = Math.floor(Math.random() * 15) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: `asset-${i + 1}`,
    type: queryBuilder.value.resourceTypes[
      Math.floor(Math.random() * queryBuilder.value.resourceTypes.length)
    ],
    name: `Sample Asset ${i + 1}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    concept:
      queryBuilder.value.concepts.length > 0
        ? queryBuilder.value.concepts[
            Math.floor(Math.random() * queryBuilder.value.concepts.length)
          ]
        : null,
  }));
}

function loadTemplate(template: any) {
  queryBuilder.value = {
    ...queryBuilder.value,
    ...template.config,
  };
}
</script>
