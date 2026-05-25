import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AtlasSidebar } from "./components/AtlasSidebar";
import { DocumentPanel } from "./components/DocumentPanel";
import { GameMap, WORLD_HEIGHT, WORLD_WIDTH, regionZones } from "./components/GameMap";
import { SearchPanel } from "./components/SearchPanel";
import { Minimap } from "./components/Minimap";
import { Compass } from "./components/Compass";
import { InAppReader } from "./components/InAppReader";
import { SettingsPanel } from "./components/SettingsPanel";
import { researchManifest } from "./data/researchManifest";
import { researchTrails } from "./data/researchTrails";
import { teleportGates } from "./data/teleportGates";
import { memoryShrines } from "./data/memoryShrines";
import type { PlayerPosition, ResearchCategory, ResearchDocument, ViewMode, ResearchGem, GemRating, TeleportGate, MemoryShrine, DailyQuest, ReaderSettings, TouchControlMode } from "./types";

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

const DISCOVERED_STORAGE_KEY = "research-atlas.discovered.v1";
const BOOKMARK_STORAGE_KEY = "research-atlas.bookmarks.v1";
const REVISIT_STORAGE_KEY = "research-atlas.revisit.v1";
const RECENT_VIEWS_STORAGE_KEY = "research-atlas.recent-views.v1";
const CHECKIN_STORAGE_KEY = "research-atlas.checkin.v1";
const THEME_STORAGE_KEY = "research-atlas.theme.v1";
const SETTINGS_STORAGE_KEY = "research-atlas.settings.v1";
const GEMS_STORAGE_KEY = "research-atlas.gems.v1";
const QUEST_STORAGE_KEY = "research-atlas.quest.v1";
const REVIEW_DUE_DAYS = 7;
const PLAYER_SPEED = 265;
const INSPECT_DISTANCE = 105;
const STARTING_POSITION: PlayerPosition = { x: 900, y: 600 };

const DEFAULT_SETTINGS: ReaderSettings = {
  documentOpenMode: "right-drawer",
  readerTheme: "system",
  readerWidth: "comfortable",
  fontSize: "medium",
  lineHeight: "comfortable",
  defaultReaderTab: "preview",
  autoMarkAsOpened: true,
  showReaderOnDocumentClick: true,
  touchControlMode: "pan-map"
};

type ThemeMode = "light" | "dark";

function loadReaderSettings(): ReaderSettings {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadThemeMode() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored as ThemeMode;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light" as ThemeMode;
  }
}

function loadGems() {
  try {
    const raw = window.localStorage.getItem(GEMS_STORAGE_KEY);
    if (!raw) return [] as ResearchGem[];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ResearchGem[]) : [];
  } catch {
    return [] as ResearchGem[];
  }
}

function calculateNextReview(rating: GemRating, currentInterval: number, currentEase: number) {
  let interval = 1;
  let ease = currentEase;

  if (rating === "forgot") {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  } else if (rating === "hard") {
    interval = Math.max(1, Math.floor(currentInterval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (rating === "good") {
    interval = Math.ceil(currentInterval * ease);
  } else if (rating === "easy") {
    interval = Math.ceil(currentInterval * ease * 1.3);
    ease = Math.min(2.5, ease + 0.15);
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    nextReviewAt: nextReviewAt.toISOString(),
    interval,
    ease
  };
}

type RecentView = {
  id: string;
  viewedAt: string;
};

const regionInfo: Array<{ category: ResearchCategory; region: string; description: string }> = [
  { category: "Health", region: "Health Highlands", description: "Sleep, movement, body systems, and recovery." },
  { category: "Health", region: "Body Systems Lab", description: "Practical body, pain, movement, and environment research." },
  { category: "Mind", region: "Mind Forest", description: "Attention, emotion, reflection, and patterns." },
  { category: "Mind", region: "ADHD Focus Grove", description: "Attention, screens, neurodiversity, and self-understanding." },
  { category: "Family", region: "Family Grove", description: "Marriage, parenting, home life, and memory." },
  { category: "Family", region: "Parenting Haven", description: "Home support, meltdowns, education and family rhythms." },
  { category: "Family", region: "Marriage & Connection Garden", description: "Emotional intimacy, Christian marriage, and restoration." },
  { category: "Faith", region: "Faith Chapel", description: "Christian formation, vocation, prayer, and wisdom." },
  { category: "Tech", region: "Tech Citadel", description: "AI, ICT, app building, security, and career." },
  { category: "Tech", region: "Tech & AI Citadel Expansion", description: "AI security, game building, and systems thinking." },
  { category: "Life", region: "Life Observatory", description: "Timelines, goals, personal data, and meta-analysis." },
  { category: "Life", region: "Life Analytics Observatory", description: "Whole-life synthesis and future planning." },
  { category: "Life", region: "Places & Calling Map", description: "Place-based research, community, and calling." },
  { category: "Life", region: "Work & Vocation Guildhall", description: "Career pathways, operational fit, and future work." },
  { category: "Archive", region: "Archive Caverns", description: "Older exports, reports, and unsorted research." }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function loadDiscoveredIds() {
  return loadIdSet(DISCOVERED_STORAGE_KEY);
}

function loadBookmarkIds() {
  return loadIdSet(BOOKMARK_STORAGE_KEY);
}

function loadIdSet(storageKey: string) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return new Set<string>(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set<string>();
  }
}

function loadRecentViews() {
  try {
    const raw = window.localStorage.getItem(RECENT_VIEWS_STORAGE_KEY);
    if (!raw) return [] as RecentView[];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [] as RecentView[];
    return parsed.filter(
      (item): item is RecentView =>
        item && typeof item.id === "string" && typeof item.viewedAt === "string"
    );
  } catch {
    return [] as RecentView[];
  }
}

function loadCheckIn() {
  try {
    return window.localStorage.getItem(CHECKIN_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function documentMatchesQuery(document: ResearchDocument, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const searchable = [
    document.title,
    document.category,
    document.region,
    document.summary || "",
    document.type,
    ...(document.tags ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(normalized);
}

function distanceBetween(player: PlayerPosition, target: { x: number; y: number }) {
  return Math.hypot(player.x - target.x, player.y - target.y);
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | "All">("All");
  const [selectedTrailId, setSelectedTrailId] = useState<string | "All">("All");
  const [player, setPlayer] = useState<PlayerPosition>(STARTING_POSITION);
  const [zoom, setZoom] = useState(1.0);
  const [selectedDocument, setSelectedDocument] = useState<ResearchDocument | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() => loadReaderSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedShrineId, setSelectedShrineId] = useState<string | null>(null);
  const [shrineDiscovery, setShrineDiscovery] = useState<ResearchDocument | null>(null);
  const [isTeleportMenuOpen, setIsTeleportMenuOpen] = useState(false);
  const [isMinimapOpen, setIsMinimapOpen] = useState(true);
  const [trackingDocumentId, setTrackingDocumentId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => loadDiscoveredIds());
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() => loadBookmarkIds());
  const [revisitIds, setRevisitIds] = useState<Set<string>>(() => loadIdSet(REVISIT_STORAGE_KEY));
  const [recentViews, setRecentViews] = useState<RecentView[]>(() => loadRecentViews());
  const [checkIn, setCheckIn] = useState<string>(() => loadCheckIn());
  const [gems, setGems] = useState<ResearchGem[]>(() => loadGems());
  const [dailyQuest, setDailyQuest] = useState<DailyQuest | null>(null);

  const playerRef = useRef(player);
  const keysRef = useRef(new Set<string>());
  const touchVectorRef = useRef({ x: 0, y: 0 });
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredDocuments = useMemo(() => {
    const selectedTrail = researchTrails.find((trail) => trail.id === selectedTrailId);
    const trailDocumentIds = selectedTrail ? new Set(selectedTrail.documentIds) : null;

    return researchManifest.filter((document) => {
      const categoryMatches = selectedCategory === "All" || document.category === selectedCategory;
      const trailMatches = !trailDocumentIds || trailDocumentIds.has(document.id);
      return categoryMatches && trailMatches && documentMatchesQuery(document, query);
    });
  }, [query, selectedCategory, selectedTrailId]);

  const nearestDocument = useMemo(() => {
    let nearest: ResearchDocument | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const document of filteredDocuments) {
      const distance = distanceBetween(player, document);
      if (distance <= INSPECT_DISTANCE && distance < nearestDistance) {
        nearest = document;
        nearestDistance = distance;
      }
    }

    return nearest;
  }, [filteredDocuments, player]);

  const nearestGate = useMemo(() => {
    let nearest: TeleportGate | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const gate of teleportGates) {
      const distance = distanceBetween(player, gate);
      if (distance <= INSPECT_DISTANCE && distance < nearestDistance) {
        nearest = gate;
        nearestDistance = distance;
      }
    }

    return nearest;
  }, [player]);

  const nearestShrine = useMemo(() => {
    let nearest: MemoryShrine | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const shrine of memoryShrines) {
      const distance = distanceBetween(player, shrine);
      if (distance <= INSPECT_DISTANCE && distance < nearestDistance) {
        nearest = shrine;
        nearestDistance = distance;
      }
    }

    return nearest;
  }, [player]);

  const setDiscovered = useCallback((documentId: string) => {
    setDiscoveredIds((current) => {
      const next = new Set(current);
      next.add(documentId);
      try {
        window.localStorage.setItem(DISCOVERED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // localStorage unavailable or blocked
      }
      return next;
    });
  }, []);

  const resetDiscovered = useCallback(() => {
    if (window.confirm("Reset discovery progress? This will clear your discovered markers.")) {
      try {
        window.localStorage.removeItem(DISCOVERED_STORAGE_KEY);
      } catch {
        // ignore localStorage errors
      }
      setDiscoveredIds(new Set());
      setSelectedDocument(null);
    }
  }, []);

  const toggleBookmark = useCallback((document: ResearchDocument) => {
    setBookmarkIds((current) => {
      const next = new Set(current);
      if (next.has(document.id)) {
        next.delete(document.id);
      } else {
        next.add(document.id);
      }

      try {
        window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }

      return next;
    });
  }, []);

  const toggleRevisit = useCallback((document: ResearchDocument) => {
    setRevisitIds((current) => {
      const next = new Set(current);
      if (next.has(document.id)) {
        next.delete(document.id);
      } else {
        next.add(document.id);
      }

      try {
        window.localStorage.setItem(REVISIT_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }

      return next;
    });
  }, []);

  const updateReaderSettings = (updates: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const inspectDocument = useCallback(
    (document: ResearchDocument) => {
      setSelectedDocument(document);
      setDiscovered(document.id);

      if (readerSettings.documentOpenMode !== "external") {
        setIsReaderOpen(true);
      } else {
        window.open(document.url, "_blank", "noopener,noreferrer");
      }

      const viewedAt = new Date().toISOString();
      setRecentViews((current) => {
        const next = [{ id: document.id, viewedAt }, ...current.filter((item) => item.id !== document.id)];
        const truncated = next.slice(0, 10);
        try {
          window.localStorage.setItem(RECENT_VIEWS_STORAGE_KEY, JSON.stringify(truncated));
        } catch {
          // ignore storage errors
        }
        return truncated;
      });
    },
    [setDiscovered]
  );

  const movePlayer = useCallback((deltaSeconds: number) => {
    const keys = keysRef.current;
    const touchVector = touchVectorRef.current;

    let dx = touchVector.x;
    let dy = touchVector.y;

    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;

    if (dx === 0 && dy === 0) return;

    const length = Math.hypot(dx, dy) || 1;
    const next = {
      x: clamp(playerRef.current.x + (dx / length) * PLAYER_SPEED * deltaSeconds, 35, WORLD_WIDTH - 35),
      y: clamp(playerRef.current.y + (dy / length) * PLAYER_SPEED * deltaSeconds, 35, WORLD_HEIGHT - 35)
    };

    playerRef.current = next;
    setPlayer(next);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = window.localStorage.getItem(QUEST_STORAGE_KEY);
    let quest: DailyQuest | null = null;

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        quest = parsed;
      }
    }

    if (!quest) {
      // Create new quest
      const types: DailyQuest["type"][] = ["discover", "rediscover", "ignore", "revisit", "favourite"];
      const type = types[Math.floor(Math.random() * types.length)];
      const regions = regionInfo.map(r => r.region);
      const targetRegion = regions[Math.floor(Math.random() * regions.length)];

      let description = "";
      switch (type) {
        case "discover": description = `Visit one new document in ${targetRegion}.`; break;
        case "rediscover": description = "Rediscover one old document."; break;
        case "ignore": description = "Open one document from a region you have ignored."; break;
        case "revisit": description = "Mark one document as worth revisiting."; break;
        case "favourite": description = "Favourite one high-value document."; break;
      }

      quest = {
        id: crypto.randomUUID(),
        type,
        description,
        targetRegion,
        completed: false,
        date: today
      };
      window.localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quest));
    }

    setDailyQuest(quest);
  }, []);

  const completeQuest = useCallback(() => {
    if (!dailyQuest || dailyQuest.completed) return;
    const updated = { ...dailyQuest, completed: true };
    setDailyQuest(updated);
    window.localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(updated));
    alert("Daily Quest Completed!");
  }, [dailyQuest]);

  // Check for quest completion
  useEffect(() => {
    if (!dailyQuest || dailyQuest.completed || !selectedDocument) return;

    if (dailyQuest.type === "discover" && selectedDocument.region === dailyQuest.targetRegion && !discoveredIds.has(selectedDocument.id)) {
      completeQuest();
    } else if (dailyQuest.type === "rediscover" && discoveredIds.has(selectedDocument.id)) {
      completeQuest();
    } else if (dailyQuest.type === "ignore" && discoveredIds.size > 0) {
      // Simple logic: if they opened something that wasn't in their most-viewed regions
      completeQuest();
    }
  }, [dailyQuest, selectedDocument, discoveredIds, completeQuest]);

  useEffect(() => {
    if (!dailyQuest || dailyQuest.completed) return;
    if (dailyQuest.type === "revisit" && revisitIds.size > 0) {
      completeQuest();
    } else if (dailyQuest.type === "favourite" && bookmarkIds.size > 0) {
      completeQuest();
    }
  }, [dailyQuest, revisitIds, bookmarkIds, completeQuest]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    let animationFrame = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const deltaSeconds = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      movePlayer(deltaSeconds);
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [movePlayer]);

  useEffect(() => {
    const movementKeys = new Set(["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"]);

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (key === "escape") {
        setSelectedDocument(null);
        setIsReaderOpen(false);
        setIsSettingsOpen(false);
        setSelectedShrineId(null);
        setIsTeleportMenuOpen(false);
        return;
      }

      if (key === "," && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsSettingsOpen((prev) => !prev);
        return;
      }

      if (key === "r" && !isTypingTarget(event.target)) {
        if (nearestDocument) {
          event.preventDefault();
          inspectDocument(nearestDocument);
        }
        return;
      }

      if (key === "f" && isReaderOpen && selectedDocument && !isTypingTarget(event.target)) {
        event.preventDefault();
        toggleBookmark(selectedDocument);
        return;
      }

      if (key === "v" && isReaderOpen && selectedDocument && !isTypingTarget(event.target)) {
        event.preventDefault();
        toggleRevisit(selectedDocument);
        return;
      }

      if (key === "o" && isReaderOpen && selectedDocument && !isTypingTarget(event.target)) {
        event.preventDefault();
        window.open(selectedDocument.url, "_blank", "noopener,noreferrer");
        return;
      }

      if (key === "m" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsMinimapOpen((prev) => !prev);
        return;
      }

      if (key === "t" && !isTypingTarget(event.target)) {
        if (nearestGate) {
          event.preventDefault();
          setIsTeleportMenuOpen(true);
        }
        return;
      }

      if (key === "=" || key === "+") {
        if (!isTypingTarget(event.target)) {
          event.preventDefault();
          setZoom((prev) => Math.min(2.0, prev + 0.1));
        }
        return;
      }

      if (key === "-") {
        if (!isTypingTarget(event.target)) {
          event.preventDefault();
          setZoom((prev) => Math.max(0.5, prev - 0.1));
        }
        return;
      }

      if (key === "0") {
        if (!isTypingTarget(event.target)) {
          event.preventDefault();
          setZoom(1.0);
        }
        return;
      }

      if (
        (key === "e" || key === "enter" || key === " ") &&
        viewMode === "map" &&
        !isTypingTarget(event.target)
      ) {
        if (nearestDocument) {
          event.preventDefault();
          inspectDocument(nearestDocument);
          return;
        }
        if (nearestShrine) {
          event.preventDefault();
          setSelectedShrineId(nearestShrine.id);
          return;
        }
      }

      if (movementKeys.has(key) && !isTypingTarget(event.target)) {
        event.preventDefault();
        keysRef.current.add(key);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [inspectDocument, nearestDocument, viewMode]);

  useEffect(() => {
    window.advanceTime = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / (1000 / 60)));
      for (let index = 0; index < steps; index += 1) {
        movePlayer(1 / 60);
      }
    };

    return () => {
      delete window.advanceTime;
    };
  }, [movePlayer]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        coordinateSystem: "Origin is top-left of the 1800x1200 world. X increases right. Y increases down.",
        viewMode,
        player: {
          x: Math.round(playerRef.current.x),
          y: Math.round(playerRef.current.y)
        },
        nearestDocument: nearestDocument
          ? {
              id: nearestDocument.id,
              title: nearestDocument.title,
              distance: Math.round(distanceBetween(playerRef.current, nearestDocument))
            }
          : null,
        selectedDocument: selectedDocument
          ? {
              id: selectedDocument.id,
              title: selectedDocument.title
            }
          : null,
        visibleDocuments: filteredDocuments.slice(0, 12).map((document) => ({
          id: document.id,
          title: document.title,
          x: document.x,
          y: document.y,
          category: document.category,
          discovered: discoveredIds.has(document.id)
        })),
        visibleDocumentCount: filteredDocuments.length,
        discoveredCount: discoveredIds.size,
        bookmarkCount: bookmarkIds.size,
        totalCount: researchManifest.length,
        activeFilter: selectedCategory,
        activeTrail: selectedTrailId,
        query
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [bookmarkIds, discoveredIds, filteredDocuments, nearestDocument, query, selectedCategory, selectedDocument, selectedTrailId, viewMode]);

  const setTouchVector = (x: number, y: number) => {
    touchVectorRef.current = { x, y };
  };

  const clearTouchVector = () => {
    touchVectorRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (!selectedShrineId) {
      setShrineDiscovery(null);
      return;
    }

    const shrine = memoryShrines.find((s) => s.id === selectedShrineId);
    if (!shrine) return;

    // Pick a document to rediscovery
    const undiscoveredInRegion = researchManifest.filter(
      (d) => d.region === shrine.region && !discoveredIds.has(d.id)
    );

    if (undiscoveredInRegion.length > 0) {
      setShrineDiscovery(undiscoveredInRegion[Math.floor(Math.random() * undiscoveredInRegion.length)]);
      return;
    }

    const discoveredInRegion = researchManifest.filter(
      (d) => d.region === shrine.region && discoveredIds.has(d.id)
    );

    if (discoveredInRegion.length > 0) {
      // Sort by last viewed (if possible) or just random
      setShrineDiscovery(discoveredInRegion[Math.floor(Math.random() * discoveredInRegion.length)]);
      return;
    }

    // Fallback: random undiscovered anywhere
    const anyUndiscovered = researchManifest.filter((d) => !discoveredIds.has(d.id));
    if (anyUndiscovered.length > 0) {
      setShrineDiscovery(anyUndiscovered[Math.floor(Math.random() * anyUndiscovered.length)]);
    }
  }, [selectedShrineId, discoveredIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // ignore localStorage errors
    }
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  };

  const teleportTo = (x: number, y: number, name: string) => {
    const next = { x, y };
    playerRef.current = next;
    setPlayer(next);
    setIsTeleportMenuOpen(false);
    alert(`Teleported to ${name}`);
  };

  const jumpToRegion = (region: string) => {
    const zone = regionZones.find((item) => item.region === region);
    if (!zone) return;

    const next = {
      x: zone.x + zone.width / 2,
      y: zone.y + zone.height / 2
    };

    playerRef.current = next;
    setPlayer(next);
    setViewMode("map");
    clearTouchVector();
  };

  const closeDocument = () => {
    setSelectedDocument(null);
    setIsReaderOpen(false);
    setFocusMode(false);
  };

  const saveCheckIn = (text: string) => {
    setCheckIn(text);
    try {
      window.localStorage.setItem(CHECKIN_STORAGE_KEY, text);
    } catch {
      // ignore storage errors
    }
  };

  const addGem = useCallback((gemData: Omit<ResearchGem, "id" | "createdAt" | "nextReviewAt" | "interval" | "ease">) => {
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + 1);

    const newGem: ResearchGem = {
      ...gemData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nextReviewAt: nextReviewAt.toISOString(),
      interval: 1,
      ease: 2.5
    };

    setGems((current) => {
      const next = [...current, newGem];
      try {
        window.localStorage.setItem(GEMS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const rateGem = useCallback((gemId: string, rating: GemRating) => {
    setGems((current) => {
      const next = current.map((gem) => {
        if (gem.id !== gemId) return gem;
        const updates = calculateNextReview(rating, gem.interval, gem.ease);
        return { ...gem, ...updates };
      });
      try {
        window.localStorage.setItem(GEMS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const inspectDocumentById = useCallback(
    (documentId: string) => {
      const document = researchManifest.find((item) => item.id === documentId);
      if (document) {
        inspectDocument(document);
      }
    },
    [inspectDocument]
  );

  const relatedDocuments = useMemo(() => {
    if (!selectedDocument) return [];

    const sameRegion = researchManifest.filter(
      (document) => document.id !== selectedDocument.id && document.region === selectedDocument.region
    );

    const sameTag = researchManifest.filter(
      (document) =>
        document.id !== selectedDocument.id &&
        (document.tags ?? []).some((tag) => (selectedDocument.tags ?? []).includes(tag))
    );

    const combined = [...sameRegion, ...sameTag];
    const unique = Array.from(new Map(combined.map((document) => [document.id, document])).values());

    return unique.slice(0, 4);
  }, [selectedDocument]);

  const currentRegion = useMemo(() => {
    const zone = regionZones.find(
      (zone) => player.x >= zone.x && player.x <= zone.x + zone.width && player.y >= zone.y && player.y <= zone.y + zone.height
    );
    return zone?.region ?? "Wilderness";
  }, [player]);

  const progressPercent = Math.round((discoveredIds.size / researchManifest.length) * 100);

  const nextUndiscovered = useMemo(() => {
    return researchManifest.find((document) => !discoveredIds.has(document.id));
  }, [discoveredIds]);

  const recentDocuments = useMemo(() => {
    return recentViews
      .map((view) => {
        const document = researchManifest.find((item) => item.id === view.id);
        return document ? { ...document, viewedAt: view.viewedAt } : null;
      })
      .filter((document): document is ResearchDocument & { viewedAt: string } => document !== null)
      .slice(0, 5);
  }, [recentViews]);

  const reviewDueDocuments = useMemo(() => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return recentDocuments
      .map((document) => {
        const daysAgo = Math.floor((Date.now() - new Date(document.viewedAt).getTime()) / msPerDay);
        return { ...document, daysAgo };
      })
      .filter((document) => document.daysAgo >= REVIEW_DUE_DAYS)
      .sort((a, b) => b.daysAgo - a.daysAgo)
      .slice(0, 3);
  }, [recentDocuments]);

  const todayTarget = useMemo(() => {
    if (reviewDueDocuments.length > 0) {
      return `Review ${reviewDueDocuments[0].title} again.`;
    }
    if (nextUndiscovered) {
      return `Discover ${nextUndiscovered.title} in ${nextUndiscovered.region}.`;
    }
    return "You have discovered all documents. Review or refine your notes.";
  }, [nextUndiscovered, reviewDueDocuments]);

  const trailOptions = useMemo(() => {
    return researchTrails.map((trail) => ({
      id: trail.id,
      title: trail.title,
      description: trail.description,
      total: trail.documentIds.length,
      discovered: trail.documentIds.filter((id) => discoveredIds.has(id)).length
    }));
  }, [discoveredIds]);

  const reviewDueGems = useMemo(() => {
    const now = new Date();
    return gems
      .filter((gem) => new Date(gem.nextReviewAt) <= now)
      .map((gem) => {
        const doc = researchManifest.find((d) => d.id === gem.documentId);
        return { ...gem, documentTitle: doc?.title ?? "Unknown Document" };
      });
  }, [gems]);

  const rediscoveryQuest = useMemo(() => {
    const discoveredDocs = researchManifest.filter((doc) => discoveredIds.has(doc.id));
    if (discoveredDocs.length === 0) return null;

    const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const candidates = discoveredDocs.filter((doc) => {
      const recentView = recentViews.find((v) => v.id === doc.id);
      return !recentView || new Date(recentView.viewedAt).getTime() < thirtyDaysAgo;
    });

    if (candidates.length === 0) return null;
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  }, [discoveredIds, recentViews]);

  const bookmarkedDocuments = useMemo(() => {
    return researchManifest.filter((document) => bookmarkIds.has(document.id));
  }, [bookmarkIds]);

  const listDocuments = filteredDocuments.map((document) => {
    const discovered = discoveredIds.has(document.id);
    const bookmarked = bookmarkIds.has(document.id);
    return (
      <article key={document.id} className={`list-card list-card--${document.category.toLowerCase()}`}>
        <div>
          <p className="eyebrow">{document.region}</p>
          <h2>{document.title}</h2>
          <p>{document.summary}</p>
          <div className="tag-list">
            {document.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="list-card__actions">
          <span>{discovered ? "Discovered" : "Undiscovered"}</span>
          <button
            type="button"
            className={bookmarked ? "is-saved" : ""}
            onClick={() => toggleBookmark(document)}
          >
            {bookmarked ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={() => inspectDocument(document)}>
            Inspect
          </button>
        </div>
      </article>
    );
  });

  const isFocusActive = focusMode && selectedDocument !== null;

  return (
    <main className={isFocusActive ? "app-shell app-shell--focus" : "app-shell"}>
      {!isFocusActive && (
        <div className="app-layout">
          <div className="side-column">
            <AtlasSidebar
              discoveredCount={discoveredIds.size}
              totalCount={researchManifest.length}
              progressPercent={progressPercent}
              todayTarget={todayTarget}
              regionInfo={regionInfo}
              currentRegion={currentRegion}
              onJumpToRegion={jumpToRegion}
              onResetProgress={resetDiscovered}
              themeMode={themeMode}
              onThemeToggle={toggleThemeMode}
              checkIn={checkIn}
              onCheckInChange={setCheckIn}
              onCheckInSave={() => saveCheckIn(checkIn)}
              recentViews={recentDocuments.map((document) => ({
                id: document.id,
                title: document.title,
                viewedAt: document.viewedAt
              }))}
              reviewDue={reviewDueDocuments.map((document) => ({
                id: document.id,
                title: document.title,
                daysAgo: document.daysAgo
              }))}
              bookmarks={bookmarkedDocuments.map((document) => ({
                id: document.id,
                title: document.title
              }))}
              onInspectBookmark={inspectDocumentById}
              reviewDueGems={reviewDueGems}
              onRateGem={rateGem}
              rediscoveryQuest={rediscoveryQuest ? { id: rediscoveryQuest.id, title: rediscoveryQuest.title } : null}
              onStartQuest={inspectDocumentById}
              dailyQuest={dailyQuest}
            />

            <SearchPanel
              query={query}
              onQueryChange={setQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTrailId={selectedTrailId}
              onTrailChange={setSelectedTrailId}
              trails={trailOptions}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={filteredDocuments.length}
              searchInputRef={searchInputRef}
            />
          </div>

          <div className="content-column">
            {viewMode === "map" ? (
              <div className="map-container-relative">
                  <GameMap
                    documents={filteredDocuments}
                    player={player}
                    nearestDocumentId={nearestDocument?.id ?? null}
                    nearestGateId={nearestGate?.id ?? null}
                    nearestShrineId={nearestShrine?.id ?? null}
                    discoveredIds={discoveredIds}
                    onInspectDocument={inspectDocument}
                    onInspectShrine={(id) => setSelectedShrineId(id)}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    trackingDocument={researchManifest.find(d => d.id === trackingDocumentId) ?? null}
                    touchControlMode={readerSettings.touchControlMode}
                  />

                  <div className="map-controls">
                    <button onClick={() => setIsSettingsOpen(true)} title="Settings (,)">⚙</button>
                    <button onClick={() => setZoom(prev => clamp(prev + 0.1, 0.5, 2.0))} title="Zoom In">+</button>
                    <button onClick={() => setZoom(prev => clamp(prev - 0.1, 0.5, 2.0))} title="Zoom Out">-</button>
                    <button onClick={() => setZoom(1.0)} title="Reset Zoom">1:1</button>
                    <button
                      onClick={() => {
                        // We'd need viewport here, but for now just fit to a reasonable wide view
                        setZoom(0.5);
                      }}
                      title="Fit World"
                    >
                      Fit
                    </button>
                  </div>

                <div className="map-overlays">
                  <Minimap
                    player={player}
                    isOpen={isMinimapOpen}
                    onToggle={() => setIsMinimapOpen(!isMinimapOpen)}
                    onTeleport={(gate) => teleportTo(gate.destinationX, gate.destinationY, gate.name)}
                  />
                  <Compass
                    player={player}
                    target={nextUndiscovered ?? null}
                    isTracking={!!trackingDocumentId}
                    onTrack={(id) => setTrackingDocumentId(id)}
                  />
                </div>
              </div>
            ) : (
              <section className="list-view" aria-label="Research document list">
                {listDocuments.length > 0 ? listDocuments : <p className="empty-state">No documents match the current search.</p>}
              </section>
            )}
          </div>
        </div>
      )}

      {!isFocusActive && viewMode === "map" && (
        <div className="touch-controls" aria-label="Touch movement controls">
          <button
            type="button"
            className="touch-controls__button touch-controls__button--up"
            title="Move up"
            onPointerDown={() => setTouchVector(0, -1)}
            onPointerUp={clearTouchVector}
            onPointerLeave={clearTouchVector}
          >
            ^
          </button>
          <button
            type="button"
            className="touch-controls__button touch-controls__button--left"
            title="Move left"
            onPointerDown={() => setTouchVector(-1, 0)}
            onPointerUp={clearTouchVector}
            onPointerLeave={clearTouchVector}
          >
            &lt;
          </button>
          <button
            type="button"
            className="touch-controls__button touch-controls__button--right"
            title="Move right"
            onPointerDown={() => setTouchVector(1, 0)}
            onPointerUp={clearTouchVector}
            onPointerLeave={clearTouchVector}
          >
            &gt;
          </button>
          <button
            type="button"
            className="touch-controls__button touch-controls__button--down"
            title="Move down"
            onPointerDown={() => setTouchVector(0, 1)}
            onPointerUp={clearTouchVector}
            onPointerLeave={clearTouchVector}
          >
            v
          </button>
          <button
            type="button"
            className="touch-controls__inspect"
            disabled={!nearestDocument}
            onClick={() => nearestDocument && inspectDocument(nearestDocument)}
          >
            E
          </button>
        </div>
      )}

      <SettingsPanel
        settings={readerSettings}
        onUpdate={updateReaderSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {selectedDocument && (
        <InAppReader
          document={selectedDocument}
          isOpen={isReaderOpen}
          onClose={() => setIsReaderOpen(false)}
          readerSettings={readerSettings}
          onOpenExternal={(doc) => window.open(doc.url, "_blank", "noopener,noreferrer")}
          onMarkAsRead={(id) => setDiscovered(id)}
          onAddFavourite={toggleBookmark}
          onMarkForRevisit={toggleRevisit}
          onAddGem={addGem}
          relatedDocuments={relatedDocuments}
          isFavourite={bookmarkIds.has(selectedDocument.id)}
          isRevisit={revisitIds.has(selectedDocument.id)}
          isRead={discoveredIds.has(selectedDocument.id)}
        />
      )}

      {selectedDocument && (
        <DocumentPanel
          document={selectedDocument}
          discovered={discoveredIds.has(selectedDocument.id)}
          bookmarked={bookmarkIds.has(selectedDocument.id)}
          revisit={revisitIds.has(selectedDocument.id)}
          focusMode={focusMode}
          onToggleBookmark={toggleBookmark}
          onToggleRevisit={toggleRevisit}
          onToggleFocusMode={() => setFocusMode((current) => !current)}
          onClose={closeDocument}
          relatedDocuments={relatedDocuments}
          onInspectRelated={inspectDocument}
          onAddGem={addGem}
        />
      )}

      {isTeleportMenuOpen && (
        <div className="teleport-menu-overlay" onClick={() => setIsTeleportMenuOpen(false)}>
          <div className="teleport-menu" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Travel</h3>
            <div className="teleport-grid">
              {teleportGates.map((gate) => (
                <button
                  key={gate.id}
                  className="teleport-option"
                  onClick={() => teleportTo(gate.destinationX, gate.destinationY, gate.name)}
                >
                  <strong>{gate.name}</strong>
                  <span>{gate.region}</span>
                </button>
              ))}
            </div>
            <button className="close-button" onClick={() => setIsTeleportMenuOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {selectedShrineId && (
        <div className="shrine-panel-overlay" onClick={() => setSelectedShrineId(null)}>
          <div className="shrine-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Memory Shrine</h3>
            <p className="eyebrow">{memoryShrines.find(s => s.id === selectedShrineId)?.region}</p>
            <div className="shrine-content">
              {shrineDiscovery ? (
                <div className="shrine-discovery">
                  <h4>Rediscover this research</h4>
                  <div className="shrine-discovery-card">
                    <h5>{shrineDiscovery.title}</h5>
                    <p>{shrineDiscovery.summary}</p>
                    <div className="shrine-discovery-actions">
                      <button
                        className="primary-button"
                        onClick={() => {
                          inspectDocument(shrineDiscovery);
                          setSelectedShrineId(null);
                        }}
                      >
                        Open Document
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          toggleBookmark(shrineDiscovery);
                        }}
                      >
                        {bookmarkIds.has(shrineDiscovery.id) ? "Favorited" : "Favorite"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>The shrine is silent. All current research in this region has been integrated.</p>
              )}
            </div>
            <button className="close-button" onClick={() => setSelectedShrineId(null)}>Leave Shrine</button>
          </div>
        </div>
      )}
    </main>
  );
}
