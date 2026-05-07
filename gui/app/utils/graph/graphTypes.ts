import type * as d3 from "d3";
import type { DigitalAsset } from "./assetTypes";

export type NodeShape = "circle" | "rect";

export interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  size: number;
  shape: NodeShape;
  width?: number;
  height?: number;
  isSelected?: boolean;
  asset: DigitalAsset;
}

export interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
  label?: string;
}
