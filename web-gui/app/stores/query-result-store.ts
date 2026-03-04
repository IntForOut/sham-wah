import { defineStore } from "pinia";
import { ref } from "vue";

import { MOCK_ASSETS } from "~/utils/graph/mockData";

export interface QueryResult {
  count: number;
  executionTime: number;
  data: DigitalAsset[];
}

export interface DigitalAsset {
  id: string;
  type: string;
  name: string;
  comment: string;
  publisher?: string;
  location?: string[];
  concepts: string[];
  metadata?: Record<string, unknown>;
}

export interface QueryParams {
  query: string;
  concepts: string[];
  assetType: string;
  limit: number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useHumanActivitiesStore = defineStore("humanActivities", () => {
  const isExecuting = ref(false);
  const results = ref<QueryResult | null>(null);
  const error = ref<string | null>(null);
  const queryHistory = ref<QueryParams[]>([]);

  async function executeQuery(params: QueryParams) {
    isExecuting.value = true;
    error.value = null;
    results.value = null;
    queryHistory.value = [params, ...queryHistory.value].slice(0, 10);
    try {
      results.value = await fetchFromNeo4j(params);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      isExecuting.value = false;
    }
  }

  function fetchFromNeo4j(params: QueryParams): Promise<QueryResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered =
          params.assetType === "all"
            ? MOCK_ASSETS
            : MOCK_ASSETS.filter(
                (a) => a.type.toLowerCase() === params.assetType.toLowerCase(),
              );
        resolve({
          count: Math.min(filtered.length, params.limit),
          executionTime: Math.floor(Math.random() * 300) + 50,
          data: filtered.slice(0, params.limit),
        });
      }, 800);
    });
  }

  function clearResults() {
    results.value = null;
    error.value = null;
  }
  function clearHistory() {
    queryHistory.value = [];
  }
  function getLastQuery(): QueryParams | null {
    return queryHistory.value[0] ?? null;
  }

  return {
    isExecuting,
    results,
    error,
    queryHistory,
    executeQuery,
    clearResults,
    clearHistory,
    getLastQuery,
  };
});
