import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { ASSET_BY_ID, MOCK_NEIGHBOR_GRAPHS } from "~/utils/graph/mockData";
import type { DigitalAsset } from "~/stores/query-result-store";
import type { NodeDatum, LinkDatum } from "~/utils/graph/graphTypes";
import { buildGraphData, type RawEdge } from "~/utils/graph/graphAdapter";
import { storeToRefs } from "pinia";

interface NeighborGraph {
  nodes: DigitalAsset[];
  edges: RawEdge[];
}

export const useGraphStore = defineStore("graph", () => {
  const selectedAsset = ref<DigitalAsset | null>(null);
  const graphNodes = shallowRef<NodeDatum[]>([]);
  const graphEdges = shallowRef<LinkDatum[]>([]);
  const isLoadingNeighbors = ref(false);
  const error = ref<string | null>(null);
  const config = useRuntimeConfig();

  const uiStrore = useUiStore();
  const { activeSidebarTab } = storeToRefs(uiStrore);

  async function selectAsset(asset: DigitalAsset) {
    selectedAsset.value = asset;
    isLoadingNeighbors.value = true;
    error.value = null;
    try {
      const fetcher =
        activeSidebarTab.value === "mock"
          ? fetchNeighborGraphMock
          : fetchNeighborGraph;
      const { nodes, edges } = await fetcher(asset.id);
      const { nodes: graphN, links } = buildGraphData(asset, nodes, edges);
      graphNodes.value = graphN;
      graphEdges.value = links;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load neighbors";
    } finally {
      isLoadingNeighbors.value = false;
    }
  }

  function clearGraph() {
    selectedAsset.value = null;
    graphNodes.value = [];
    graphEdges.value = [];
    error.value = null;
  }

  async function fetchNeighborGraphMock(
    assetId: string,
  ): Promise<NeighborGraph> {
    await new Promise((r) => setTimeout(r, 400));
    const mock = MOCK_NEIGHBOR_GRAPHS[assetId];
    if (!mock) return { nodes: [], edges: [] };
    return {
      nodes: mock.nodeIds
        .map((id) => ASSET_BY_ID[id])
        .filter((a): a is DigitalAsset => a !== undefined),
      edges: mock.edges,
    };
  }

  async function fetchNeighborGraph(assetId: string): Promise<NeighborGraph> {
    const url = encodeURIComponent(assetId);
    const response = await fetch(
      `${config.public.NEO4J_API_URL}/graph/neighbors/?asset_id=${url}&depth=2`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail ?? `API error: ${response.status}`);
    }
    return response.json();
  }

  return {
    selectedAsset,
    graphNodes,
    graphEdges,
    isLoadingNeighbors,
    error,
    selectAsset,
    clearGraph,
  };
});
