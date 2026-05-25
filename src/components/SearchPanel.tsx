import type { ResearchCategory, ViewMode } from "../types";
import { researchCategories } from "../data/researchManifest";

type SearchPanelProps = {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: ResearchCategory | "All";
  onCategoryChange: (category: ResearchCategory | "All") => void;
  selectedTrailId: string | "All";
  onTrailChange: (trailId: string | "All") => void;
  trails: Array<{
    id: string;
    title: string;
    description: string;
    discovered: number;
    total: number;
  }>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
};

export function SearchPanel({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  selectedTrailId,
  onTrailChange,
  trails,
  viewMode,
  onViewModeChange,
  resultCount,
  searchInputRef
}: SearchPanelProps) {
  return (
    <section className="search-panel" aria-label="Atlas search and filters">
      <div className="view-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          className={viewMode === "map" ? "is-active" : ""}
          onClick={() => onViewModeChange("map")}
        >
          Map View
        </button>
        <button
          type="button"
          className={viewMode === "list" ? "is-active" : ""}
          onClick={() => onViewModeChange("list")}
        >
          List View
        </button>
      </div>

      <label className="search-panel__field">
        <span>Search</span>
        <input
          ref={searchInputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Title, tag, region, summary"
          type="search"
        />
      </label>

      <div className="category-filter" aria-label="Category filters">
        <button
          type="button"
          className={selectedCategory === "All" ? "is-active" : ""}
          onClick={() => onCategoryChange("All")}
        >
          All
        </button>
        {researchCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? "is-active" : ""}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="trail-filter" aria-label="Research trails">
        <div className="trail-filter__header">
          <strong>Research Trails</strong>
          <button
            type="button"
            className={selectedTrailId === "All" ? "is-active" : ""}
            onClick={() => onTrailChange("All")}
          >
            All
          </button>
        </div>
        {trails.map((trail) => (
          <button
            key={trail.id}
            type="button"
            className={selectedTrailId === trail.id ? "is-active" : ""}
            onClick={() => onTrailChange(trail.id)}
          >
            <span>{trail.title}</span>
            <small>
              {trail.discovered}/{trail.total} - {trail.description}
            </small>
          </button>
        ))}
      </div>

      <p className="search-panel__count">{resultCount} documents visible</p>
    </section>
  );
}
