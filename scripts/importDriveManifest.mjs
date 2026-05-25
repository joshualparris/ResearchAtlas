import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? "src/data/researchManifest.ts";

if (!inputPath) {
  console.error("Usage: npm run import:manifest -- path/to/research.csv [outputPath]");
  process.exit(1);
}

const requiredHeaders = [
  "id",
  "title",
  "category",
  "region",
  "tags",
  "summary",
  "url",
  "type",
  "x",
  "y"
];

const categories = ["Health", "Mind", "Family", "Faith", "Tech", "Life", "Archive"];
const types = ["pdf", "google-doc", "folder", "docx", "other"];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function quote(value) {
  return JSON.stringify(value);
}

function normalizeDocument(record, index) {
  const title = record.title.trim();
  const id = (record.id.trim() || slugify(title)).trim();
  const category = record.category.trim();
  const type = record.type.trim();
  const x = Number(record.x);
  const y = Number(record.y);
  const tags = record.tags
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const errors = [];
  const label = id || title || `row ${index + 2}`;

  if (!id) errors.push(`${label}: missing id or title`);
  if (!title) errors.push(`${label}: missing title`);
  if (!categories.includes(category)) errors.push(`${label}: invalid category ${category}`);
  if (!record.region.trim()) errors.push(`${label}: missing region`);
  if (!record.summary.trim()) errors.push(`${label}: missing summary`);
  if (!record.url.trim()) errors.push(`${label}: missing url`);
  if (!types.includes(type)) errors.push(`${label}: invalid type ${type}`);
  if (!Number.isFinite(x) || !Number.isFinite(y)) errors.push(`${label}: invalid x/y coordinates`);
  if (tags.length === 0) errors.push(`${label}: at least one tag is required`);

  return {
    document: {
      id,
      title,
      category,
      region: record.region.trim(),
      tags,
      summary: record.summary.trim(),
      url: record.url.trim(),
      type,
      x,
      y
    },
    errors
  };
}

const csv = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
const rows = parseCsv(csv);

if (rows.length < 2) {
  console.error("CSV must include a header row and at least one document row.");
  process.exit(1);
}

const headers = rows[0].map((header) => header.trim());
const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

if (missingHeaders.length > 0) {
  console.error(`CSV is missing required header(s): ${missingHeaders.join(", ")}`);
  process.exit(1);
}

const documents = [];
const errors = [];

rows.slice(1).forEach((row, index) => {
  const record = Object.fromEntries(headers.map((header, headerIndex) => [header, row[headerIndex] ?? ""]));
  const result = normalizeDocument(record, index);
  documents.push(result.document);
  errors.push(...result.errors);
});

const duplicateIds = documents
  .map((document) => document.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

for (const id of new Set(duplicateIds)) errors.push(`${id}: duplicate id`);

if (errors.length > 0) {
  console.error(`Manifest import failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const body = documents
  .map(
    (document) => `  {
    id: ${quote(document.id)},
    title: ${quote(document.title)},
    category: ${quote(document.category)},
    region: ${quote(document.region)},
    tags: [${document.tags.map(quote).join(", ")}],
    summary: ${quote(document.summary)},
    url: ${quote(document.url)},
    type: ${quote(document.type)},
    x: ${document.x},
    y: ${document.y}
  }`
  )
  .join(",\n");

const file = `import type { ResearchDocument } from "../types";

export const researchManifest: ResearchDocument[] = [
${body}
];

export const researchCategories = [
  "Health",
  "Mind",
  "Family",
  "Faith",
  "Tech",
  "Life",
  "Archive"
] as const;
`;

fs.writeFileSync(outputPath, file);
console.log(`Wrote ${documents.length} documents to ${outputPath}`);
