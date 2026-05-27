export interface BaseAsset {
  id: string;
  name: string;
  comment: string;
  rdfs_label?: string;
}

export interface DatasetAsset extends BaseAsset {
  type: "Dataset";
  publisher?: string;
  location?: string[];
}

export interface DataServiceAsset extends BaseAsset {
  type: "DataService";
  publisher?: string;
  location?: string[];
}

export interface CatalogAsset extends BaseAsset {
  type: "Catalog";
  publisher?: string;
}

export interface UserFeedbackAsset extends BaseAsset {
  type: "UserFeedback";
  author: string;
}

export interface DocumentAsset extends BaseAsset {
  type: "Document";
  pdfUrl: string;
}

export interface ScientificPaperAsset extends BaseAsset {
  type: "ScientificPaper";
}

export type DigitalAsset =
  | DatasetAsset
  | DataServiceAsset
  | CatalogAsset
  | UserFeedbackAsset
  | DocumentAsset
  | ScientificPaperAsset;
