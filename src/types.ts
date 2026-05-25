export type ResearchCategory =
  | "Health"
  | "Mind"
  | "Family"
  | "Faith"
  | "Tech"
  | "Life"
  | "Archive";

export type ResearchDocumentType =
  | "pdf"
  | "google-doc"
  | "folder"
  | "docx"
  | "other";

export type ResearchDocument = {
  id: string;
  title: string;
  category: ResearchCategory;
  region: string;
  tags: string[];
  summary: string;
  url: string;
  type: ResearchDocumentType;
  x: number;
  y: number;
};

export type PlayerPosition = {
  x: number;
  y: number;
};

export type ViewMode = "map" | "list";

