import type { DigitalAsset } from "~/stores/query-result-store";
import type { NodeDatum, LinkDatum } from "./graphTypes";

export const TYPE_COLORS: Record<string, string> = {
  Dataset: "#3B82F6",
  DataService: "#3B82F6",
  ScientificPaper: "#7ed957",
  Catalog: "#3B82F6",
  UserFeedback: "#F59E0B",
};

const TYPE_SIZES: Record<string, number> = {
  Dataset: 50,
  DataService: 50,
  ScientificPaper: 50,
  Catalog: 50,
  UserFeedback: 50, // rect nodes — size unused visually but kept for collision
};

const DEFAULT_COLOR = "#94A3B8";
const DEFAULT_SIZE = 50;

export interface RawEdge {
  source: string;
  target: string;
  label?: string;
}

export function assetToNode(
  asset: DigitalAsset,
  isSelected = false,
): NodeDatum {
  const isRect = asset.type === "UserFeedback";
  return {
    id: asset.id,
    label: asset.name,
    description: asset.comment,
    publisher: asset.publisher,
    location: asset.location,
    color: TYPE_COLORS[asset.type] ?? DEFAULT_COLOR,
    size: TYPE_SIZES[asset.type] ?? DEFAULT_SIZE,
    shape: isRect ? "rect" : "circle",
    width: isRect ? 160 : undefined,
    height: isRect ? 56 : undefined,
    type: asset.type,
    concepts: asset.concepts ?? [],
    isSelected,
  };
}

export function buildGraphData(
  selected: DigitalAsset,
  neighbors: DigitalAsset[],
  edges: RawEdge[],
): { nodes: NodeDatum[]; links: LinkDatum[] } {
  const nodes: NodeDatum[] = [
    assetToNode(selected, true),
    ...neighbors.map((n) => assetToNode(n, false)),
  ];
  const links: LinkDatum[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
    label: e.label,
  }));
  return { nodes, links };
}
