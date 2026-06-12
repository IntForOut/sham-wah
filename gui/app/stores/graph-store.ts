import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { ASSET_BY_ID, MOCK_NEIGHBOR_GRAPHS } from "~/utils/graph/mockData";
import type { NodeDatum, LinkDatum } from "~/utils/graph/graphTypes";
import { buildGraphData, type RawEdge } from "~/utils/graph/graphAdapter";
import { storeToRefs } from "pinia";
import type { DigitalAsset } from "~/utils/graph/assetTypes";

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

  const uiStore = useUiStore();
  const { activeSidebarTab } = storeToRefs(uiStore);

  async function selectAsset(asset: DigitalAsset) {
    selectedAsset.value = asset;
    isLoadingNeighbors.value = true;
    error.value = null;
    try {
      const fetcher =
        activeSidebarTab.value === "mock"
          ? fetchNeighborGraphMock
          : fetchNeighborGraph;

      const { nodes, edges } = await fetcher(asset.id, 2);
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
    depth?: number,
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
  async function fetchNeighborGraph(
    assetId: string,
    depth: number = 1,
  ): Promise<NeighborGraph> {
    const url = encodeURIComponent(assetId);
    const response = await fetch(
      `${config.public.NEO4J_API_URL}/graph/neighbors/?asset_id=${url}&depth=${depth}`,
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

  // Add to state
  const expandedNodeIds = ref<Set<string>>(new Set());

  const expansionChildren = ref<Map<string, Set<string>>>(new Map());

  async function toggleNodeExpansion(nodeId: string) {
    if (expandedNodeIds.value.has(nodeId)) {
      // --- COLLAPSE ---
      collapseNode(nodeId);
    } else {
      // --- EXPAND ---
      await expandNode(nodeId);
    }
  }

  async function expandNode(nodeId: string) {
    const node = graphNodes.value.find((n) => n.id === nodeId);
    if (!node) return;

    isLoadingNeighbors.value = true;
    try {
      const fetcher =
        activeSidebarTab.value === "mock"
          ? fetchNeighborGraphMock
          : fetchNeighborGraph;
      const { nodes: newAssets, edges: newEdges } = await fetcher(nodeId, 1);

      const { nodes: newNodeData, links: newLinkData } = buildGraphData(
        node.asset,
        newAssets,
        newEdges,
      );

      const existingIds = new Set(graphNodes.value.map((n) => n.id));
      const childIds = new Set<string>();

      // Merge only new nodes
      const mergedNodes = [...graphNodes.value];
      for (const n of newNodeData) {
        if (!existingIds.has(n.id)) {
          mergedNodes.push(n);
          childIds.add(n.id);
        }
      }

      // Merge only edges not already present
      const existingEdgeKeys = new Set(
        graphEdges.value.map((e) => `${e.source}->${e.target}`),
      );
      const mergedEdges = [...graphEdges.value];
      for (const e of newLinkData) {
        const key = `${e.source}->${e.target}`;
        if (!existingEdgeKeys.has(key)) {
          mergedEdges.push(e);
        }
      }

      expansionChildren.value.set(nodeId, childIds);
      expandedNodeIds.value.add(nodeId);

      // shallowRef requires reassignment to trigger reactivity
      graphNodes.value = mergedNodes;
      graphEdges.value = mergedEdges;
    } finally {
      isLoadingNeighbors.value = false;
    }
  }

  function collapseNode(nodeId: string) {
    const children = expansionChildren.value.get(nodeId);
    if (!children) return;

    // Only remove a child if no other expanded node also has it
    const protectedIds = new Set<string>();
    for (const [ownerId, childSet] of expansionChildren.value) {
      if (ownerId !== nodeId) {
        for (const id of childSet) protectedIds.add(id);
      }
    }

    const toRemove = new Set(
      [...children].filter((id) => !protectedIds.has(id)),
    );

    graphNodes.value = graphNodes.value.filter((n) => !toRemove.has(n.id));
    graphEdges.value = graphEdges.value.filter((e) => {
      const src =
        typeof e.source === "string" ? e.source : (e.source as any).id;
      const tgt =
        typeof e.target === "string" ? e.target : (e.target as any).id;
      return !toRemove.has(src) && !toRemove.has(tgt);
    });

    expansionChildren.value.delete(nodeId);
    expandedNodeIds.value.delete(nodeId);
  }

  return {
    selectedAsset,
    graphNodes,
    graphEdges,
    isLoadingNeighbors,
    error,
    selectAsset,
    clearGraph,
    expandedNodeIds,
    expansionChildren,
    toggleNodeExpansion,
    expandNode,
    collapseNode,
  };
});
