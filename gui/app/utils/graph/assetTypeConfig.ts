import type { DigitalAsset } from "./assetTypes";
import type { NodeShape } from "./graphTypes";

export interface AssetTypeConfig {
  color: string;
  shape: NodeShape;
  size: number;
  width?: number;
  height?: number;
}

export const ASSET_TYPE_CONFIG: Record<DigitalAsset["type"], AssetTypeConfig> =
  {
    Dataset: { color: "#3B82F6", shape: "circle", size: 70 },
    DataService: { color: "#3B82F6", shape: "circle", size: 70 },
    Catalog: { color: "#3B82F6", shape: "circle", size: 70 },
    ScientificPaper: { color: "#7ed957", shape: "circle", size: 70 },
    TechnicalDocument: { color: "#F8CB63", shape: "circle", size: 70 },
    Process: { color: "#c963f8", shape: "circle", size: 70 },
    UserFeedback: {
      color: "#F59E0B",
      shape: "rect",
      size: 100,
      width: 160,
      height: 60,
    },
  };
