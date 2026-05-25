import { useState, useEffect } from "react";
import type { ResearchDocument, ReaderSettings, ReaderTab, ResearchGem } from "../types";
import { getEmbeddedPreviewUrl, isGoogleDriveUrl } from "../utils/driveLinks";

type InAppReaderProps = {
  document: ResearchDocument;
  isOpen: boolean;
  onClose: () => void;
  readerSettings: ReaderSettings;
  onOpenExternal: (doc: ResearchDocument) => void;
  onMarkAsRead: (id: string) => void;
  onAddFavourite: (doc: ResearchDocument) => void;
  onMarkForRevisit: (doc: ResearchDocument) => void;
  onAddGem?: (gem: Omit<ResearchGem, "id" | "createdAt" | "nextReviewAt" | "interval" | "ease">) => void;
  relatedDocuments: ResearchDocument[];
  isFavourite: boolean;
  isRevisit: boolean;
  isRead: boolean;
};

export function InAppReader({
  document,
  isOpen,
  onClose,
  readerSettings,
  onOpenExternal,
  onMarkAsRead,
  onAddFavourite,
  onMarkForRevisit,
  onAddGem,
  relatedDocuments,
  isFavourite,
  isRevisit,
  isRead
}: InAppReaderProps) {
  const [activeTab, setActiveTab] = useState<ReaderTab>(readerSettings.defaultReaderTab);
  const [gemContent, setGemContent] = useState("");
  const [gemType, setGemType] = useState<ResearchGem["type"]>("insight");

  useEffect(() => {
    setActiveTab(readerSettings.defaultReaderTab);
  }, [document.id, readerSettings.defaultReaderTab]);

  if (!isOpen) return null;

  const previewUrl = getEmbeddedPreviewUrl(document.url, document.type);
  const isGoogle = isGoogleDriveUrl(document.url);

  const renderPreview = () => {
    if (document.type === "folder") {
      return (
        <div className="reader-fallback">
          <h3>Folder Collection</h3>
          <p>This is a collection of documents. Please open it externally to browse all files.</p>
          <button className="primary-button" onClick={() => onOpenExternal(document)}>
            Open Folder Externally
          </button>
        </div>
      );
    }

    if (previewUrl) {
      return (
        <div className="reader-iframe-container">
          <iframe
            src={previewUrl}
            title={document.title}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay"
          />
          {isGoogle && (
            <div className="reader-iframe-note">
              <small>Google preview might not follow theme. Use Summary tab for full theme control.</small>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="reader-fallback">
        <h3>Preview Unavailable</h3>
        <p>We couldn't generate an in-app preview for this document type.</p>
        <button className="primary-button" onClick={() => onOpenExternal(document)}>
          Open Document Externally
        </button>
      </div>
    );
  };

  const renderSummary = () => {
    const readingTime = document.readingTimeEstimate || "5-10 min read";
    const difficulty = document.difficulty || "moderate";

    return (
      <div className="reader-kindle-content">
        <header className="kindle-header">
          <p className="eyebrow">{document.region} • {document.category}</p>
          <h1>{document.title}</h1>
          <div className="kindle-meta">
            <span className={`difficulty-badge difficulty-${difficulty}`}>{difficulty}</span>
            <span>{readingTime}</span>
          </div>
        </header>

        <section className="kindle-section">
          <h3>Summary</h3>
          <p className="summary-text">{document.summary}</p>
        </section>

        <section className="kindle-section">
          <h3>Key Details</h3>
          <div className="tag-list">
            {document.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
          </div>
        </section>

        {(document.memoryPrompt || document.actionPrompt) && (
          <section className="kindle-section prompts-grid">
            {document.memoryPrompt && (
              <div className="kindle-prompt-card">
                <strong>Memory Prompt</strong>
                <p>{document.memoryPrompt}</p>
              </div>
            )}
            {document.actionPrompt && (
              <div className="kindle-prompt-card">
                <strong>Suggested Action</strong>
                <p>{document.actionPrompt}</p>
              </div>
            )}
          </section>
        )}

        {document.keyPassages && document.keyPassages.length > 0 && (
          <section className="kindle-section">
            <h3>Key Passages</h3>
            <ul className="kindle-passages">
              {document.keyPassages.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </section>
        )}
      </div>
    );
  };

  const renderMemory = () => {
    return (
      <div className="reader-memory-content">
        <div className="memory-prompts">
          <div className="memory-prompt-box">
            <strong>Active Recall: Before Reading</strong>
            <p>What do you already know or remember about this topic?</p>
            <textarea placeholder="Type your thoughts..." rows={3} />
          </div>

          <div className="memory-prompt-box">
            <strong>Synthesis: After Reading</strong>
            <p>What is the one most useful idea from this research?</p>
            <textarea placeholder="Type your thoughts..." rows={3} />
          </div>
        </div>

        <div className="memory-gem-capture">
          <strong>Capture Gem</strong>
          <div className="gem-input-group">
            <select value={gemType} onChange={e => setGemType(e.target.value as any)}>
              <option value="insight">Insight</option>
              <option value="question">Question</option>
              <option value="quotation">Quotation</option>
            </select>
            <textarea 
              value={gemContent} 
              onChange={e => setGemContent(e.target.value)}
              placeholder="Externalise your memory..."
              rows={2}
            />
            <button 
              className="secondary-button" 
              disabled={!gemContent.trim()}
              onClick={() => {
                onAddGem?.({ documentId: document.id, content: gemContent, type: gemType });
                setGemContent("");
              }}
            >
              Save Gem
            </button>
          </div>
        </div>

        <div className="memory-actions">
          <strong>Review Schedule</strong>
          <div className="revisit-buttons">
            <button onClick={() => onMarkForRevisit(document)}>Mark for Revisit</button>
            <button onClick={() => onAddFavourite(document)}>
              {isFavourite ? "Remove Favourite" : "Add Favourite"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRelated = () => {
    return (
      <div className="reader-related-content">
        <h3>Related Research</h3>
        <div className="related-grid">
          {relatedDocuments.map(doc => (
            <div key={doc.id} className="related-mini-card">
              <strong>{doc.title}</strong>
              <p>{doc.summary.slice(0, 80)}...</p>
              <span className="tag-pill">{doc.category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`in-app-reader reader-mode-${readerSettings.documentOpenMode} theme-${readerSettings.readerTheme} width-${readerSettings.readerWidth} font-${readerSettings.fontSize}`}>
      <div className="reader-shell">
        <header className="reader-header">
          <div className="reader-header-left">
            <button className="icon-button" onClick={onClose} title="Close (Esc)">X</button>
            <span className="reader-title-short">{document.title}</span>
          </div>
          
          <nav className="reader-tabs">
            <button className={activeTab === "preview" ? "active" : ""} onClick={() => setActiveTab("preview")}>Preview</button>
            <button className={activeTab === "summary" ? "active" : ""} onClick={() => setActiveTab("summary")}>Summary</button>
            <button className={activeTab === "memory" ? "active" : ""} onClick={() => setActiveTab("memory")}>Memory</button>
            <button className={activeTab === "related" ? "active" : ""} onClick={() => setActiveTab("related")}>Related</button>
          </nav>

          <div className="reader-header-actions">
            <button className="icon-button" onClick={() => onOpenExternal(document)} title="Open Externally (O)">↗</button>
            <button className={`icon-button ${isFavourite ? "active" : ""}`} onClick={() => onAddFavourite(document)} title="Favourite (F)">★</button>
            <button className={`icon-button ${isRevisit ? "active" : ""}`} onClick={() => onMarkForRevisit(document)} title="Revisit (V)">↻</button>
          </div>
        </header>

        <main className="reader-body">
          {activeTab === "preview" && renderPreview()}
          {activeTab === "summary" && renderSummary()}
          {activeTab === "memory" && renderMemory()}
          {activeTab === "related" && renderRelated()}
        </main>
      </div>
    </div>
  );
}
