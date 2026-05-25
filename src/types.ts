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
  readingTimeEstimate?: string;
  difficulty?: "light" | "moderate" | "deep";
  memoryPrompt?: string;
  actionPrompt?: string;
};

export type TeleportGate = {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  destinationX: number;
  destinationY: number;
  description: string;
};

export type MemoryShrine = {
  id: string;
  region: string;
  x: number;
  y: number;
  description: string;
};

export type DailyQuest = {
  id: string;
  type: "discover" | "rediscover" | "ignore" | "revisit" | "favourite";
  description: string;
  targetRegion?: string;
  completed: boolean;
  date: string;
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
