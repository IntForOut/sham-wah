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
  issued?: string;
}

export interface DataServiceAsset extends BaseAsset {
  type: "DataService";
  publisher?: string;
  location?: string[];
  seealso?: string;
}

export interface CatalogAsset extends BaseAsset {
  type: "Catalog";
  publisher?: string;
  homepage?: string;
}

export interface UserFeedbackAsset extends BaseAsset {
  type: "UserFeedback";
  author: string;
}

export interface TechnicalDocumentAsset extends BaseAsset {
  type: "TechnicalDocument";
  pdfUrl: string;
  author: string;
}

export interface ScientificPaperAsset extends BaseAsset {
  type: "ScientificPaper";
  authorID: string;
  publisher: string;
  publication_year: string;
  subject?: string[];
}

export interface ProcessAsset extends BaseAsset {
  type: "Process";
}

export type DigitalAsset =
  | DatasetAsset
  | DataServiceAsset
  | CatalogAsset
  | UserFeedbackAsset
  | TechnicalDocumentAsset
  | ScientificPaperAsset
  | ProcessAsset;
