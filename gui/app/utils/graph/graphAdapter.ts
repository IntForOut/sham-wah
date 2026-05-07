import type { DigitalAsset } from "./assetTypes";
import { ASSET_TYPE_CONFIG } from "./assetTypeConfig";
import type { NodeDatum, LinkDatum } from "./graphTypes";

export interface RawEdge {
  source: string;
  target: string;
  label?: string;
}

export function assetToNode(
  asset: DigitalAsset,
  isSelected = false,
): NodeDatum {
  const config = ASSET_TYPE_CONFIG[asset.type];
  return {
    id: asset.id,
    label: asset.name,
    asset,
    color: config.color,
    size: config.size,
    shape: config.shape,
    width: config.width,
    height: config.height,
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
