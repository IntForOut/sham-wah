import { defineStore } from "pinia";
import { ref } from "vue";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QueryResult {
  count: number;
  executionTime: number;
  data: DigitalAsset[];
}

export interface DigitalAsset {
  id: string;
  type: string;
  name: string;
  description: string;
  concepts: string[];
  metadata?: Record<string, unknown>;
}

export interface QueryParams {
  query: string;
  concepts: string[];
  assetType: string;
  limit: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ASSETS: DigitalAsset[] = [
  {
    id: "ov-tracks-2024",
    type: "Dataset",
    name: "OVTracksMontBlancBauges2024",
    description:
      "A set of tracks issued from Outdoorvision. GPS traces from Outdoorvision are cleaned and filtered.",
    concepts: ["Outdoorvision", "GPS Traces"],
  },
  {
    id: "strava-tracks-2014",
    type: "Dataset",
    name: "StravaTracksBauges2014",
    description: "No description available.",
    concepts: ["Strava", "Bauges"],
  },
  {
    id: "ov-map-service",
    type: "DataService",
    name: "OVRecreationalUserMapService",
    description:
      "Displays aggregated paths of GPS tracks from connected services in the Outdoorvision application.",
    concepts: ["Map Service", "Outdoorvision"],
  },
  {
    id: "strava-map-service",
    type: "DataService",
    name: "StravaRecreationalUserMapService",
    description:
      "Shows aggregated public activities from the past year on Strava.",
    concepts: ["Strava", "Recreational"],
  },
  {
    id: "c2c-routes-2025",
    type: "Dataset",
    name: "CampToCampRoutesBauges2025",
    description: "A set of routes issued from Camptocamp.org API.",
    concepts: ["Camptocamp", "Routes"],
  },
  {
    id: "altirando-2025",
    type: "Dataset",
    name: "AltitudeRandoRoutesBauges2025",
    description: "A set of routes issued from altituderando.com.",
    concepts: ["Altituderando", "Routes"],
  },
  {
    id: "c2c-poi-2025",
    type: "Dataset",
    name: "CampToCampPOIBauges2025",
    description: "A set of waypoints issued from Camptocamp.org API.",
    concepts: ["Camptocamp", "POI"],
  },
  {
    id: "skilift-counters",
    type: "Dataset",
    name: "SkiLiftCountersMontBlanc2008To2024",
    description:
      "Counting data for each ski lift, including their locations (start and end points), over a 10-year period.",
    concepts: ["Ski Lift", "Counting"],
  },
  {
    id: "bdtopo-2025",
    type: "Dataset",
    name: "BDTopoSentiersBauges2025",
    description:
      "La BD TOPO® version 3.5 contient une description vectorielle 3D des éléments du territoire.",
    concepts: ["BD TOPO", "Sentiers"],
  },
  {
    id: "paper-marchand-2025",
    type: "ScientificPaper",
    name: "JournalOfPeopleAndNatureMarchandEtAl2025",
    description:
      "Disturbance by massive sporting events in mountain areas: When and where matters for the protected Alpine ibex Capra ibex.",
    concepts: ["Alpine Ibex", "Disturbance"],
  },
  {
    id: "paper-vandamme-2024",
    type: "ScientificPaper",
    name: "SIGSPATIAL24VandDammeEtAl2024",
    description:
      "A metrological analysis of a modular and iterative aggregation algorithm of GNSS trajectories.",
    concepts: ["GNSS", "Trajectories"],
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useHumanActivitiesStore = defineStore("humanActivities", () => {
  // State
  const isExecuting = ref(false);
  const results = ref<QueryResult | null>(null);
  const error = ref<string | null>(null);
  const queryHistory = ref<QueryParams[]>([]);

  // Actions
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
      console.error("Query execution error:", err);
    } finally {
      isExecuting.value = false;
    }
  }

  /**
   * Replace the mock below with a real fetch call when the API is ready.
   *
   * Example:
   *   const response = await fetch('/api/neo4j/query', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ query: params.query, parameters: { concepts: params.concepts, limit: params.limit } }),
   *   })
   *   if (!response.ok) throw new Error(`Neo4j API error: ${response.statusText}`)
   *   return transformNeo4jResponse(await response.json())
   */
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

  /**
   * Uncomment and adapt once Neo4j responses are wired in.
   *
   * function transformNeo4jResponse(neo4jData: any): QueryResult {
   *   const assets = neo4jData.records.map((record: any) => ({
   *     id: record.get('asset').identity.toString(),
   *     type: record.get('asset').labels[0],
   *     name: record.get('asset').properties.name,
   *     description: record.get('asset').properties.description,
   *     concepts: record.get('concept') ? [record.get('concept').labels[0]] : [],
   *   }))
   *   return { count: assets.length, executionTime: neo4jData.summary.resultAvailableAfter, data: assets }
   * }
   */

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
    // State
    isExecuting,
    results,
    error,
    queryHistory,
    // Actions
    executeQuery,
    clearResults,
    clearHistory,
    // Getters
    getLastQuery,
  };
});
