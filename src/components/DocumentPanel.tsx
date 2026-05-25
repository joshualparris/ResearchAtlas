import type { ResearchDocument } from "../types";

type DocumentPanelProps = {
  document: ResearchDocument;
  discovered: boolean;
  onClose: () => void;
};

export function DocumentPanel({ document, discovered, onClose }: DocumentPanelProps) {
  const openDocument = () => {
    window.open(document.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="document-panel" aria-label="Research document details">
      <div className="document-panel__header">
        <div>
          <p className="eyebrow">{document.region}</p>
          <h2>{document.title}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close document panel">
          X
        </button>
      </div>

      <div className="document-panel__meta">
        <span>{document.category}</span>
        <span>{document.type}</span>
        <span>{discovered ? "Discovered" : "New"}</span>
      </div>

      <p className="document-panel__summary">{document.summary}</p>

      <div className="tag-list" aria-label="Document tags">
        {document.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <button className="primary-button" type="button" onClick={openDocument}>
        Open Document
      </button>
    </section>
  );
}

