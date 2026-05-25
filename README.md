# Research Atlas

Research Atlas is a public, game-like library for deep research PDFs and Google Docs. Visitors move through a top-down fantasy map, discover document objects, inspect their summaries, and open the public Drive or Docs link in a new tab.

## Features

- React, Vite, and TypeScript
- No backend, auth, API key, or database
- WASD and arrow-key movement
- E to inspect nearby documents
- Escape to close the document panel
- Slash key focuses search
- Local discovery progress saved in `localStorage`
- Search, category filters, region legend, map view, and list view
- Public static manifest in `src/data/researchManifest.ts`

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Set the framework preset to `Vite`.
4. Use build command `npm run build`.
5. Use output directory `dist`.

Vercel will deploy from the production branch, usually `main`.

## Add Documents

Edit `src/data/researchManifest.ts` and add a new object with this shape:

```ts
export type ResearchDocument = {
  id: string;
  title: string;
  category: "Health" | "Mind" | "Family" | "Faith" | "Tech" | "Life" | "Archive";
  region: string;
  tags: string[];
  summary: string;
  url: string;
  type: "pdf" | "google-doc" | "folder" | "docx" | "other";
  x: number;
  y: number;
};
```

The `x` and `y` values place the document on the 1800 by 1200 map. Keep public Drive or Docs URLs in the `url` field.

## V2 Direction

The next useful expansion is a Drive folder import script that reads the public "Deep Research" folder and generates `src/data/researchManifest.ts` automatically.

