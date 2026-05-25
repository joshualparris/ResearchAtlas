import type { ResearchCategory } from "../types";

type RegionInfo = {
  category: ResearchCategory;
  region: string;
  description: string;
};

type AtlasSidebarProps = {
  discoveredCount: number;
  totalCount: number;
  regionInfo: RegionInfo[];
  currentRegion: string;
  onResetProgress: () => void;
};

export function AtlasSidebar({
  discoveredCount,
  totalCount,
  regionInfo,
  currentRegion,
  onResetProgress
}: AtlasSidebarProps) {
  const progressPercent = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;

  return (
    <aside className="atlas-sidebar" aria-label="Research Atlas status">
      <div className="atlas-sidebar__title">
        <p className="eyebrow">Public Library</p>
        <h1>Research Atlas</h1>
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

      <div className="region-legend" aria-label="Region legend">
        {regionInfo.map((region) => (
          <div key={region.region} className={`region-legend__item region-legend__item--${region.category.toLowerCase()}`}>
            <span />
            <div>
              <strong>{region.region}</strong>
              <p>{region.description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
