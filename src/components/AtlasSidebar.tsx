import type { ResearchCategory } from "../types";

type RegionInfo = {
  category: ResearchCategory;
  region: string;
  description: string;
};

type RecentViewInfo = {
  id: string;
  title: string;
  viewedAt: string;
};

type ReviewDueInfo = {
  id: string;
  title: string;
  daysAgo: number;
};

type BookmarkInfo = {
  id: string;
  title: string;
};

type ThemeMode = "light" | "dark";

type AtlasSidebarProps = {
  discoveredCount: number;
  totalCount: number;
  progressPercent: number;
  todayTarget: string;
  regionInfo: RegionInfo[];
  currentRegion: string;
  onJumpToRegion: (region: string) => void;
  onResetProgress: () => void;
  themeMode: ThemeMode;
  onThemeToggle: () => void;
  checkIn: string;
  onCheckInChange: (value: string) => void;
  onCheckInSave: () => void;
  recentViews: RecentViewInfo[];
  reviewDue: ReviewDueInfo[];
  bookmarks: BookmarkInfo[];
  onInspectBookmark: (documentId: string) => void;
};

export function AtlasSidebar({
  discoveredCount,
  totalCount,
  progressPercent,
  todayTarget,
  regionInfo,
  currentRegion,
  onJumpToRegion,
  onResetProgress,
  themeMode,
  onThemeToggle,
  checkIn,
  onCheckInChange,
  onCheckInSave,
  recentViews,
  reviewDue,
  bookmarks,
  onInspectBookmark
}: AtlasSidebarProps) {
  return (
    <aside className="atlas-sidebar" aria-label="Research Atlas status">
      <div className="atlas-sidebar__title">
        <div>
          <p className="eyebrow">Public Library</p>
          <h1>Research Atlas</h1>
        </div>
        <button className="theme-toggle-button" type="button" onClick={onThemeToggle}>
          {themeMode === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div className="progress-card" aria-label="Discovery progress">
        <div>
          <strong>
            {discoveredCount} / {totalCount}
          </strong>
          <span> documents discovered</span>
        </div>
        <div className="progress-card__bar">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="progress-card__footer">
          <span>Current region: {currentRegion}</span>
          <button type="button" onClick={onResetProgress}>
            Reset
          </button>
        </div>
      </div>

      <div className="sidebar-target" aria-label="Today's research target">
        <strong>Today's target</strong>
        <p>{todayTarget}</p>
        <div className="progress-badge">
          <span>{progressPercent}%</span>
          {" "}
          <small>completed</small>
        </div>
      </div>

      <div className="sidebar-checkin" aria-label="Daily check-in">
        <strong>Daily Check-in</strong>
        <p>How are you feeling physically, mentally, spiritually today?</p>
        <textarea
          value={checkIn}
          onChange={(event) => onCheckInChange(event.target.value)}
          placeholder="Write a short check-in..."
          rows={4}
        />
        <button type="button" onClick={onCheckInSave}>
          Save Check-in
        </button>
      </div>

      {(bookmarks.length > 0 || reviewDue.length > 0 || recentViews.length > 0) && (
        <div className="sidebar-suggestions" aria-label="Recent research suggestions">
          {bookmarks.length > 0 && (
            <div className="suggestion-card suggestion-card--bookmarks">
              <strong>Saved for later</strong>
              <p>Your bookmarked research shelf.</p>
              <ul>
                {bookmarks.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => onInspectBookmark(item.id)}>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviewDue.length > 0 && (
            <div className="suggestion-card suggestion-card--review-due">
              <strong>Ready to revisit</strong>
              <p>These documents are due for a review cycle.</p>
              <ul>
                {reviewDue.map((item) => (
                  <li key={item.id}>
                    {item.title} - {item.daysAgo} day{item.daysAgo === 1 ? "" : "s"} ago
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recentViews.length > 0 && (
            <div className="suggestion-card suggestion-card--recently-viewed">
              <strong>Recently opened</strong>
              <p>Jump back into your latest discoveries.</p>
              <ul>
                {recentViews.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="region-legend" aria-label="Region legend">
        {regionInfo.map((region) => (
          <div key={region.region} className={`region-legend__item region-legend__item--${region.category.toLowerCase()}`}>
            <span />
            <div>
              <strong>{region.region}</strong>
              <p>{region.description}</p>
              <button type="button" onClick={() => onJumpToRegion(region.region)}>
                Travel
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
