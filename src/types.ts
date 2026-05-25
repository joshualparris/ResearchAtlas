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

export type ResearchTrail = {
  id: string;
  title: string;
  description: string;
  documentIds: string[];
};

export type GemRating = "forgot" | "hard" | "good" | "easy";

export type ResearchGem = {
  id: string;
  documentId: string;
  content: string;
  type: "insight" | "question" | "quotation";
  createdAt: string;
  nextReviewAt: string;
  interval: number; // in days
  ease: number;
};
