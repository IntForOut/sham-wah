<template>
  <div class="space-y-6">
    <!-- QUERY SECTION -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          Requête Cypher
        </h3>
        <button
          @click="clearQuery"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Effacer
        </button>
      </div>

      <div class="space-y-3">
        <!-- TEXTAREA -->
        <div class="relative">
          <textarea
            v-model="query"
            spellcheck="false"
            placeholder="MATCH (n) RETURN n LIMIT 25"
            rows="6"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-mono focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
            @keydown.ctrl.enter="executeQuery"
            @keydown.meta.enter="executeQuery"
          ></textarea>

          <!-- Character count -->
          <div
            class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500"
          >
            {{ query.length }} caractères
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex gap-2">
          <button
            @click="executeQuery"
            :disabled="!query.trim() || isExecuting"
            class="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              !query.trim() || isExecuting
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]'
            "
          >
            <svg
              v-if="isExecuting"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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
            <span>{{ isExecuting ? "Exécution..." : "Exécuter" }}</span>
          </button>

          <button
            @click="formatQuery"
            :disabled="!query.trim()"
            class="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Formater la requête (Ctrl+Shift+F)"
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
        </div>

        <!-- Keyboard shortcuts hint -->
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
          pour exécuter
        </p>
      </div>
    </section>

    <!-- RESULTS SECTION -->
    <section v-if="results || error">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Résultats
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
              Erreur d'exécution
            </p>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1 font-mono">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- SUCCESS STATE -->
      <div
        v-else-if="results"
        class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
      >
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
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
            <p class="text-sm font-medium text-green-800 dark:text-green-300">
              Requête exécutée avec succès
            </p>
            <p class="text-sm text-green-700 dark:text-green-400 mt-1">
              {{ results.count }} résultat(s) trouvé(s) en
              {{ results.executionTime }}ms
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- EXAMPLES SECTION -->
    <section>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Exemples de requêtes
      </h3>

      <div class="space-y-2">
        <button
          v-for="(example, index) in examples"
          :key="index"
          @click="loadExample(example.query)"
          class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
        >
          <p
            class="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          >
            {{ example.title }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {{ example.query }}
          </p>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const query = ref("");
const isExecuting = ref(false);
const results = ref<{ count: number; executionTime: number } | null>(null);
const error = ref<string | null>(null);

const examples = [
  {
    title: "Récupérer tous les nœuds",
    query: "MATCH (n) RETURN n LIMIT 25",
  },
  {
    title: "Compter les nœuds par label",
    query: "MATCH (n) RETURN labels(n) AS label, count(*) AS count",
  },
  {
    title: "Trouver les relations",
    query: "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 10",
  },
  {
    title: "Chercher par propriété",
    query: 'MATCH (n {name: "example"}) RETURN n',
  },
];

async function executeQuery() {
  if (!query.value.trim() || isExecuting.value) return;

  isExecuting.value = true;
  error.value = null;
  results.value = null;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    results.value = {
      count: Math.floor(Math.random() * 100),
      executionTime: Math.floor(Math.random() * 500),
    };
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Une erreur est survenue";
  } finally {
    isExecuting.value = false;
  }
}

function clearQuery() {
  query.value = "";
  results.value = null;
  error.value = null;
}

function formatQuery() {
  if (!query.value.trim()) return;

  // Simple formatting: add line breaks after keywords
  const keywords = ["MATCH", "WHERE", "RETURN", "WITH", "ORDER BY", "LIMIT"];
  let formatted = query.value;

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\s+${keyword}\\s+`, "gi");
    formatted = formatted.replace(regex, `\n${keyword} `);
  });

  query.value = formatted.trim();
}

function loadExample(exampleQuery: string) {
  query.value = exampleQuery;
  results.value = null;
  error.value = null;
}
</script>
