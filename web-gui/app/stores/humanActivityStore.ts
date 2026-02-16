import { defineStore } from "pinia";
import { ref } from "vue";

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
  metadata?: Record<string, any>;
}

export interface QueryParams {
  query: string;
  concepts: string[];
  assetType: string;
  limit: number;
}

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

    try {
      // Store query in history
      queryHistory.value.unshift(params);
      if (queryHistory.value.length > 10) {
        queryHistory.value = queryHistory.value.slice(0, 10);
      }

      // Call Neo4j API
      const response = await callNeo4jAPI(params);
      results.value = response;
      console.log(params);
      console.log(results);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Query execution error:", err);
    } finally {
      isExecuting.value = false;
    }
  }

  async function callNeo4jAPI(params: QueryParams): Promise<QueryResult> {
    // TODO: Replace with actual Neo4j API endpoint
    // Example implementation:
    //
    // const response = await fetch('/api/neo4j/query', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: params.query,
    //     parameters: {
    //       concepts: params.concepts,
    //       limit: params.limit,
    //     },
    //   }),
    // })
    //
    // if (!response.ok) {
    //   throw new Error(`Neo4j API error: ${response.statusText}`)
    // }
    //
    // const data = await response.json()
    // return transformNeo4jResponse(data)

    // Mock implementation for development
    return mockNeo4jQuery(params);
  }

  function mockNeo4jQuery(params: QueryParams): Promise<QueryResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAssets = generateMockAssets(params);
        resolve({
          count: mockAssets.length,
          executionTime: Math.floor(Math.random() * 300) + 50,
          data: mockAssets,
        });
      }, 800);
    });
  }

  // Updated generateMockAssets to use your specific data list
  function generateMockAssets(params: QueryParams): DigitalAsset[] {
    const allMockData: DigitalAsset[] = [
      {
        id: "ov-tracks-2024",
        type: "Dataset",
        name: "OVTracksMontBlancBauges2024",
        description:
          "A set of tracks issued from Outdoorvision. GPS traces from outdoorvison are cleaned and filtered",
        concepts: ["Outdoorvision", "GPS Traces"],
      },
      {
        id: "strava-tracks-2014",
        type: "Dataset",
        name: "StravaTracksBauges2014",
        description: "No description available",
        concepts: ["Strava", "Bauges"],
      },
      {
        id: "ov-map-service",
        type: "DataService",
        name: "OVRecreationalUserMapService",
        description:
          "This data stream makes it possible to display in the Outdoorvision application the aggregated paths of GPS tracks coming from connected services...",
        concepts: ["Map Service", "Outdoorvision"],
      },
      {
        id: "strava-map-service",
        type: "DataService",
        name: "StravaRecreationalUserMapService",
        description:
          "Shows the aggregated public activities from the past year on Strava",
        concepts: ["Strava", "Recreational"],
      },
      {
        id: "c2c-routes-2025",
        type: "Dataset",
        name: "CampToCampRoutesBauges2025",
        description: "A set of Routes issued from Camptocamp.org API",
        concepts: ["Camptocamp", "Routes"],
      },
      {
        id: "altirando-2025",
        type: "Dataset",
        name: "AltitudeRandoRoutesBauges2025",
        description: "A set of routes issued from altituderando.com",
        concepts: ["Altituderando", "Routes"],
      },
      {
        id: "c2c-poi-2025",
        type: "Dataset",
        name: "CampToCampPOIBauges2025",
        description: "A set of Waypoints issued from Camptocamp.org API",
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
          "Disturbance by massive sporting events in mountain areas: When and where matters for the protected Alpine ibex Capra ibex",
        concepts: ["Alpine Ibex", "Disturbance"],
      },
      {
        id: "paper-vandamme-2024",
        type: "ScientificPaper",
        name: "SIGSPATIAL24VandDammeEtAl2024",
        description:
          "A metrological analysis of a modular and iterative aggregation algorithm of GNSS trajectories",
        concepts: ["GNSS", "Trajectories"],
      },
    ];

    // Filter based on the assetType selected in the UI
    let filtered = allMockData;
    if (params.assetType !== "all") {
      filtered = allMockData.filter(
        (asset) => asset.type.toLowerCase() === params.assetType.toLowerCase(),
      );
    }

    // Return the results limited by the 'limit' parameter
    return filtered.slice(0, params.limit);
  }

  function transformNeo4jResponse(neo4jData: any): QueryResult {
    // Transform Neo4j response format to our application format
    // This will depend on your actual Neo4j response structure
    //
    // Example transformation:
    // const assets = neo4jData.records.map((record: any) => ({
    //   id: record.get('asset').identity.toString(),
    //   type: record.get('asset').labels[0],
    //   name: record.get('asset').properties.name,
    //   description: record.get('asset').properties.description,
    //   concepts: record.get('concept') ? [record.get('concept').labels[0]] : [],
    //   metadata: record.get('asset').properties.metadata,
    // }))
    //
    // return {
    //   count: assets.length,
    //   executionTime: neo4jData.summary.resultAvailableAfter,
    //   data: assets,
    // }

    return {
      count: 0,
      executionTime: 0,
      data: [],
    };
  }

  function clearResults() {
    results.value = null;
    error.value = null;
  }

  function clearHistory() {
    queryHistory.value = [];
  }

  // Getters
  function getLastQuery(): QueryParams | null {
    return queryHistory.value[0] || null;
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
