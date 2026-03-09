import type * as d3 from "d3";

export type NodeShape = "circle" | "rect";

export interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  fullName: string;
  description: string;
  publisher?: string;
  location?: string[];
  color: string;
  size: number;
  shape: NodeShape;
  width?: number;
  height?: number;
  type: string;
  concepts: string[];
  isSelected?: boolean;
}

export interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
  label?: string;
}
