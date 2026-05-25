import { useEffect, useState, useMemo } from "react";
import type { ResearchDocument, ResearchGem } from "../types";

type DocumentPanelProps = {
  document: ResearchDocument;
  discovered: boolean;
  bookmarked: boolean;
  revisit: boolean;
  focusMode: boolean;
  onClose: () => void;
  onToggleBookmark: (document: ResearchDocument) => void;
  onToggleRevisit: (document: ResearchDocument) => void;
  onToggleFocusMode: () => void;
  relatedDocuments?: ResearchDocument[];
  onInspectRelated?: (document: ResearchDocument) => void;
  onAddGem?: (gem: Omit<ResearchGem, "id" | "createdAt" | "nextReviewAt" | "interval" | "ease">) => void;
  width: number;
  onResizeWidth: (width: number) => void;
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

const reflectiveQuestions = [
  "How might this research apply to your life or work this month?",
  "What is the one thing you will do differently after reading this?",
  "What surprised you most about these findings?",
  "How does this connect to what you already know about this topic?"
];

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
  revisit,
  focusMode,
  onClose,
  onToggleBookmark,
  onToggleRevisit,
  onToggleFocusMode,
  relatedDocuments = [],
  onInspectRelated,
  onAddGem,
  width,
  onResizeWidth
}: DocumentPanelProps) {
  const [note, setNote] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [gemContent, setGemContent] = useState("");
  const [gemType, setGemType] = useState<ResearchGem["type"]>("insight");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const hasValidUrl = isValidUrl(document.url);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    const startWidth = width;
    const startX = mouseDownEvent.clientX;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const delta = startX - mouseMoveEvent.clientX;
      onResizeWidth(Math.min(Math.max(300, startWidth + delta), window.innerWidth - 100));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const firstSentence = document.summary.split(/(?<=[.!?])\s+/)[0] || document.summary;
  const learningObjective =
    firstSentence.length > 150 ? `${firstSentence.slice(0, 147).trim()}...` : firstSentence;
  const fieldNotePrompt = fieldNotePrompts[document.category];

  const reflectiveQuestion = useMemo(() => {
    const index = document.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % reflectiveQuestions.length;
    return reflectiveQuestions[index];
  }, [document.id]);

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

  const toggleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(`${document.title}. ${document.summary}`);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleAddGem = () => {
    if (!gemContent.trim() || !onAddGem) return;
    onAddGem({
      documentId: document.id,
      content: gemContent.trim(),
      type: gemType
    });
    setGemContent("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(document.url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const difficultyLabel = document.difficulty || "moderate";
  const readingTime = document.readingTimeEstimate || "5-10 min";

  return (
    <section className="document-panel" aria-label="Research document details" style={{ width }}>
      <div className="reader-resize-handle reader-resize-handle--right-drawer" onMouseDown={startResizing} />
      <div className="document-panel__header">
        <div>
          <p className="eyebrow">{document.region}</p>
          <h2>{document.title}</h2>
        </div>
        <div className="document-panel__header-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={toggleReadAloud}
            aria-label={isReading ? "Stop reading" : "Read aloud"}
          >
            {isReading ? "Stop" : "Listen"}
          </button>
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
            {bookmarked ? "Favorited" : "Favorite"}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onToggleRevisit(document)}
            aria-pressed={revisit}
          >
            {revisit ? "For Revisit" : "Mark Revisit"}
          </button>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close document panel">
            X
          </button>
        </div>
      </div>

      <div className="document-panel__meta">
        <span>{document.category}</span>
        <span>{document.type}</span>
        <span>{discovered ? "Read" : "New"}</span>
        <span className={`difficulty-${difficultyLabel}`}>{difficultyLabel}</span>
        <span>{readingTime}</span>
        {bookmarked ? <span>Favorite</span> : null}
        {revisit ? <span>Revisit</span> : null}
        <button className="text-button" onClick={handleCopyLink}>
          {copyFeedback ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="document-panel__content">
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

        {(document.memoryPrompt || document.actionPrompt) && (
          <div className="document-panel__prompts">
            {document.memoryPrompt && (
              <div className="prompt-item">
                <strong>Memory Prompt</strong>
                <p>{document.memoryPrompt}</p>
              </div>
            )}
            {document.actionPrompt && (
              <div className="prompt-item">
                <strong>Action Prompt</strong>
                <p>{document.actionPrompt}</p>
              </div>
            )}
          </div>
        )}

        <div className="document-panel__reflective" aria-label="Reflective integration question">
          <strong>Reflection</strong>
          <p>{reflectiveQuestion}</p>
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

        <div className="document-panel__gems" aria-label="Capture Gems">
          <strong>Capture Gems</strong>
          <p className="hint">Externalise your memory: capture insights, questions, or quotes for review.</p>
          <div className="gem-input-group">
            <select
              value={gemType}
              onChange={(e) => setGemType(e.target.value as ResearchGem["type"])}
              aria-label="Gem type"
            >
              <option value="insight">Insight</option>
              <option value="question">Question</option>
              <option value="quotation">Quotation</option>
            </select>
            <textarea
              value={gemContent}
              onChange={(e) => setGemContent(e.target.value)}
              placeholder="What's worth remembering?"
              rows={2}
            />
            <button
              className="secondary-button"
              type="button"
              onClick={handleAddGem}
              disabled={!gemContent.trim()}
            >
              Add Gem
            </button>
          </div>
        </div>
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
