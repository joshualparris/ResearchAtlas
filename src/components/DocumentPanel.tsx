import type { ResearchDocument } from "../types";

type DocumentPanelProps = {
  document: ResearchDocument;
  discovered: boolean;
  onClose: () => void;
  relatedDocuments?: ResearchDocument[];
  onInspectRelated?: (document: ResearchDocument) => void;
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function DocumentPanel({
  document,
  discovered,
  onClose,
  relatedDocuments = [],
  onInspectRelated
}: DocumentPanelProps) {
  const hasValidUrl = isValidUrl(document.url);

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

      {relatedDocuments.length > 0 && onInspectRelated ? (
        <div className="related-documents" aria-label="Related documents">
          <h3>Related</h3>
          {relatedDocuments.map((relatedDocument) => (
            <button
              key={relatedDocument.id}
              type="button"
              onClick={() => onInspectRelated(relatedDocument)}
            >
              {relatedDocument.title}
            </button>
          ))}
        </div>
      ) : null}

      {hasValidUrl ? (
        <a
          className="primary-button"
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Document
        </a>
      ) : (
        <p className="missing-link">Link missing - needs update</p>
      )}
    </section>
  );
}
