import type { ResearchDocument } from "../types";

type DocumentObjectProps = {
  document: ResearchDocument;
  discovered: boolean;
  near: boolean;
  onInspect: (document: ResearchDocument) => void;
};

const typeLabels: Record<ResearchDocument["type"], string> = {
  pdf: "PDF",
  "google-doc": "DOC",
  folder: "DIR",
  docx: "DOCX",
  other: "NOTE"
};

export function DocumentObject({
  document,
  discovered,
  near,
  onInspect
}: DocumentObjectProps) {
  return (
    <button
      className={[
        "document-object",
        `document-object--${document.category.toLowerCase()}`,
        discovered ? "document-object--discovered" : "",
        near ? "document-object--near" : ""
      ].join(" ")}
      style={{ left: document.x, top: document.y }}
      onClick={() => onInspect(document)}
      aria-label={`Inspect ${document.title}`}
      type="button"
    >
      <span className="document-object__type">{typeLabels[document.type]}</span>
      <span className="document-object__title">{document.title}</span>
    </button>
  );
}

