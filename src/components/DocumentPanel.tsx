import { useEffect, useState } from "react";
import type { ResearchDocument } from "../types";

type DocumentPanelProps = {
  document: ResearchDocument;
  discovered: boolean;
  bookmarked: boolean;
  focusMode: boolean;
  onClose: () => void;
  onToggleBookmark: (document: ResearchDocument) => void;
  onToggleFocusMode: () => void;
  relatedDocuments?: ResearchDocument[];
  onInspectRelated?: (document: ResearchDocument) => void;
};

const NOTE_STORAGE_PREFIX = "research-atlas.document-note.v1:";

const fieldNotePrompts: Record<ResearchDocument["category"], string> = {
  Health: "What small habit, metric, or body signal is worth testing this week?",
  Mind: "What pattern does this explain, and what response would be kinder or clearer?",
  Family: "What conversation, repair, or home rhythm could this research strengthen?",
  Faith: "What conviction or practice should shape the next faithful step?",
  Tech: "What tool, workflow, or build idea could become a practical experiment?",
  Life: "What connects this research to the bigger story of priorities, time, and energy?",
  Archive: "What should be kept, revisited, or linked to a more active research trail?"
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
  bookmarked,
  focusMode,
  onClose,
  onToggleBookmark,
  onToggleFocusMode,
  relatedDocuments = [],
  onInspectRelated
}: DocumentPanelProps) {
  const [note, setNote] = useState("");
  const hasValidUrl = isValidUrl(document.url);

  const firstSentence = document.summary.split(/(?<=[.!?])\s+/)[0] || document.summary;
  const learningObjective =
    firstSentence.length > 150 ? `${firstSentence.slice(0, 147).trim()}...` : firstSentence;
  const fieldNotePrompt = fieldNotePrompts[document.category];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`${NOTE_STORAGE_PREFIX}${document.id}`);
      setNote(saved ?? "");
    } catch {
      setNote("");
    }
  }, [document.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${NOTE_STORAGE_PREFIX}${document.id}`, note);
    } catch {
      // ignore localStorage errors
    }
  }, [document.id, note]);

  return (
    <section className="document-panel" aria-label="Research document details">
      <div className="document-panel__header">
        <div>
          <p className="eyebrow">{document.region}</p>
          <h2>{document.title}</h2>
        </div>
        <div className="document-panel__header-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onToggleFocusMode}
            aria-pressed={focusMode}
          >
            {focusMode ? "Exit focus" : "Focus mode"}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onToggleBookmark(document)}
            aria-pressed={bookmarked}
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close document panel">
            X
          </button>
        </div>
      </div>

      <div className="document-panel__meta">
        <span>{document.category}</span>
        <span>{document.type}</span>
        <span>{discovered ? "Discovered" : "New"}</span>
        {bookmarked ? <span>Saved</span> : null}
      </div>

      <p className="document-panel__summary">{document.summary}</p>

      <div className="tag-list" aria-label="Document tags">
        {document.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="document-panel__goal" aria-label="Guided study prompt">
        <div>
          <strong>Learning objective</strong>
          <p>{learningObjective}</p>
        </div>
        <div>
          <strong>Field note prompt</strong>
          <p>{fieldNotePrompt}</p>
        </div>
      </div>

      <div className="document-panel__note" aria-label="Document note">
        <label htmlFor="document-note">Personal insight</label>
        <textarea
          id="document-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Capture one key insight or action from this document."
          rows={4}
        />
        <p className="hint">Notes are saved automatically.</p>
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
