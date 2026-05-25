import type { ResearchCategory, ViewMode } from "../types";
import { categories } from "../data/researchManifest";

type SearchPanelProps = {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: ResearchCategory | "All";
  onCategoryChange: (category: ResearchCategory | "All") => void;
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
        {categories.map((category) => (
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

      <p className="search-panel__count">{resultCount} documents visible</p>
    </section>
  );
}

