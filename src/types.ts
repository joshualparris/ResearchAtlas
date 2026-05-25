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
  keyPassages?: string[];
};

export type DocumentOpenMode = "external" | "right-drawer" | "bottom-drawer" | "top-drawer" | "fullscreen";
export type ReaderTheme = "system" | "light" | "dark" | "sepia" | "high-contrast";
export type ReaderWidth = "narrow" | "comfortable" | "wide";
export type FontSize = "small" | "medium" | "large" | "extra-large";
export type LineHeight = "compact" | "comfortable" | "spacious";
export type ReaderTab = "preview" | "summary" | "memory" | "related";
export type TouchControlMode = "pan-map" | "move-player" | "hybrid";

export type ReaderSettings = {
  documentOpenMode: DocumentOpenMode;
  readerTheme: ReaderTheme;
  readerWidth: ReaderWidth;
  fontSize: FontSize;
  lineHeight: LineHeight;
  defaultReaderTab: ReaderTab;
  autoMarkAsOpened: boolean;
  showReaderOnDocumentClick: boolean;
  touchControlMode: TouchControlMode;
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
