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
    Dataset: { color: "#3B82F6", shape: "circle", size: 50 },
    DataService: { color: "#3B82F6", shape: "circle", size: 50 },
    Catalog: { color: "#3B82F6", shape: "circle", size: 50 },
    ScientificPaper: { color: "#7ed957", shape: "circle", size: 50 },
    TechnicalDocument: { color: "#EF4444", shape: "circle", size: 50 },
    UserFeedback: {
      color: "#F59E0B",
      shape: "rect",
      size: 50,
      width: 160,
      height: 56,
    },
  };
