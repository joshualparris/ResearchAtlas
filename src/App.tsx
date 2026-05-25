import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AtlasSidebar } from "./components/AtlasSidebar";
import { DocumentPanel } from "./components/DocumentPanel";
import { GameMap, WORLD_HEIGHT, WORLD_WIDTH, regionZones } from "./components/GameMap";
import { SearchPanel } from "./components/SearchPanel";
import { researchManifest } from "./data/researchManifest";
import { researchTrails } from "./data/researchTrails";
import type { PlayerPosition, ResearchCategory, ResearchDocument, ViewMode, ResearchGem, GemRating } from "./types";

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

const DISCOVERED_STORAGE_KEY = "research-atlas.discovered.v1";
const BOOKMARK_STORAGE_KEY = "research-atlas.bookmarks.v1";
const RECENT_VIEWS_STORAGE_KEY = "research-atlas.recent-views.v1";
const CHECKIN_STORAGE_KEY = "research-atlas.checkin.v1";
const THEME_STORAGE_KEY = "research-atlas.theme.v1";
const GEMS_STORAGE_KEY = "research-atlas.gems.v1";
const REVIEW_DUE_DAYS = 7;
const PLAYER_SPEED = 265;
const INSPECT_DISTANCE = 105;
const STARTING_POSITION: PlayerPosition = { x: 900, y: 600 };

type ThemeMode = "light" | "dark";

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
  { category: "Mind", region: "Mind Forest", description: "Attention, emotion, reflection, and patterns." },
  { category: "Family", region: "Family Grove", description: "Marriage, parenting, home life, and memory." },
  { category: "Faith", region: "Faith Chapel", description: "Christian formation, vocation, prayer, and wisdom." },
  { category: "Tech", region: "Tech Citadel", description: "AI, ICT, app building, security, and career." },
  { category: "Life", region: "Life Observatory", description: "Timelines, goals, personal data, and meta-analysis." },
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

function distanceBetween(player: PlayerPosition, document: ResearchDocument) {
  return Math.hypot(player.x - document.x, player.y - document.y);
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
  const [selectedDocument, setSelectedDocument] = useState<ResearchDocument | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => loadDiscoveredIds());
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() => loadBookmarkIds());
  const [recentViews, setRecentViews] = useState<RecentView[]>(() => loadRecentViews());
  const [checkIn, setCheckIn] = useState<string>(() => loadCheckIn());
  const [gems, setGems] = useState<ResearchGem[]>(() => loadGems());

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

  const inspectDocument = useCallback(
    (document: ResearchDocument) => {
      setSelectedDocument(document);
      setDiscovered(document.id);
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
        return;
      }

      if (
        (key === "e" || key === "enter" || key === " ") &&
        viewMode === "map" &&
        nearestDocument &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        inspectDocument(nearestDocument);
        return;
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
              <GameMap
                documents={filteredDocuments}
                player={player}
                nearestDocumentId={nearestDocument?.id ?? null}
                discoveredIds={discoveredIds}
                onInspectDocument={inspectDocument}
              />
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

      {selectedDocument && (
        <DocumentPanel
          document={selectedDocument}
          discovered={discoveredIds.has(selectedDocument.id)}
          bookmarked={bookmarkIds.has(selectedDocument.id)}
          focusMode={focusMode}
          onToggleBookmark={toggleBookmark}
          onToggleFocusMode={() => setFocusMode((current) => !current)}
          onClose={closeDocument}
          relatedDocuments={relatedDocuments}
          onInspectRelated={inspectDocument}
          onAddGem={addGem}
        />
      )}
    </main>
  );
}
