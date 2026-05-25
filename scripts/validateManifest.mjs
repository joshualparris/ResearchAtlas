import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve("src/data/researchManifest.ts");
const source = fs.readFileSync(manifestPath, "utf8");

const allowedCategories = new Set(["Health", "Mind", "Family", "Faith", "Tech", "Life", "Archive"]);
const allowedTypes = new Set(["pdf", "google-doc", "folder", "docx", "other"]);
const forbiddenPattern = /PLACEHOLDER|example\.com|TODO-only|url:\s*""|url:\s*"#"/i;
const publicGoogleUrlPattern =
  /^https:\/\/(docs\.google\.com\/document\/d\/[A-Za-z0-9_-]+\/edit\?usp=sharing|drive\.google\.com\/(file\/d\/[A-Za-z0-9_-]+\/view\?usp=sharing|drive\/folders\/[A-Za-z0-9_-]+\?usp=sharing))$/;

function getString(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*"([^"]*)"`, "m"));
  return match?.[1] ?? "";
}

function getTags(block) {
  const match = block.match(/tags:\s*\[([^\]]*)\]/m);
  if (!match) return [];
  return Array.from(match[1].matchAll(/"([^"]+)"/g)).map((item) => item[1]);
}

function getNumber(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*(-?\\d+(?:\\.\\d+)?)`, "m"));
  return match ? Number(match[1]) : Number.NaN;
}

const blocks = Array.from(source.matchAll(/\{\s*id:[\s\S]*?\n\s*\}/g)).map((match) => match[0]);
const documents = blocks.map((block) => ({
  id: getString(block, "id"),
  title: getString(block, "title"),
  category: getString(block, "category"),
  region: getString(block, "region"),
  tags: getTags(block),
  summary: getString(block, "summary"),
  url: getString(block, "url"),
  type: getString(block, "type"),
  x: getNumber(block, "x"),
  y: getNumber(block, "y")
}));

const errors = [];
const ids = new Set();

if (forbiddenPattern.test(source)) {
  errors.push("Manifest contains a forbidden placeholder, empty, or hash-only URL marker.");
}

documents.forEach((document, index) => {
  const label = document.id || `entry ${index + 1}`;

  if (!document.id) errors.push(`${label}: missing id`);
  if (ids.has(document.id)) errors.push(`${label}: duplicate id`);
  ids.add(document.id);

  if (!document.title) errors.push(`${label}: missing title`);
  if (!allowedCategories.has(document.category)) errors.push(`${label}: invalid category ${document.category}`);
  if (!document.region) errors.push(`${label}: missing region`);
  if (!document.summary) errors.push(`${label}: missing summary`);
  if (!allowedTypes.has(document.type)) errors.push(`${label}: invalid type ${document.type}`);
  if (!Number.isFinite(document.x) || !Number.isFinite(document.y)) errors.push(`${label}: invalid map coordinates`);
  if (!Array.isArray(document.tags) || document.tags.length === 0) errors.push(`${label}: missing tags`);
  if (!publicGoogleUrlPattern.test(document.url)) errors.push(`${label}: invalid public Google URL`);
});

if (documents.length === 0) errors.push("No manifest documents found.");

if (errors.length > 0) {
  console.error(`Manifest validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Manifest validation passed: ${documents.length} documents, ${ids.size} unique ids.`);
