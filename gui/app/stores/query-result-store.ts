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
}

export interface QueryParams {
  concepts: string[];
  assetType: string;
  limit: number;
}

export const useHumanActivitiesStore = defineStore("humanActivities", () => {
  const isExecuting = ref(false);
  const results = ref<QueryResult | null>(null);
  const error = ref<string | null>(null);
  const queryHistory = ref<QueryParams[]>([]);
  const config = useRuntimeConfig();

  async function executeQuery(params: QueryParams) {
    isExecuting.value = true;
    error.value = null;
    results.value = null;
    queryHistory.value = [params, ...queryHistory.value].slice(0, 10);
    try {
      results.value = await fetchFromNeo4j(params);
      console.log("Query executed successfully:");
      console.table(results.value.data);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      isExecuting.value = false;
    }
  }

  async function executeQueryMockData(params: QueryParams) {
    isExecuting.value = true;
    error.value = null;
    results.value = null;
    queryHistory.value = [params, ...queryHistory.value].slice(0, 10);
    try {
      results.value = await fetchFromNeo4jMockData(params);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      isExecuting.value = false;
    }
  }

  function fetchFromNeo4jMockData(params: QueryParams): Promise<QueryResult> {
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

  async function fetchFromNeo4j(params: QueryParams): Promise<QueryResult> {
    const response = await fetch(
      `${config.public.NEO4J_API_URL}/assets/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepts: params.concepts,
          assetType: params.assetType,
          limit: params.limit,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail ?? `API error: ${response.status}`);
    }

    return response.json();
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
    executeQueryMockData,
    clearResults,
    clearHistory,
    getLastQuery,
  };
});
