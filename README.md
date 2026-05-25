# Research Atlas

Research Atlas is a public, game-like library for deep research PDFs and Google Docs. Visitors move through a top-down fantasy map, discover document objects, inspect their summaries, and open the public Drive or Docs link in a new tab.

## Features

- **React, Vite, and TypeScript**: Modern, performant frontend stack.
- **Light/Dark Mode**: High-contrast themes for accessibility and deep research.
- **Game-like Exploration**: WASD and arrow-key movement through a top-down fantasy map.
- **Advanced Navigation**: Zoom controls, Teleportation Gates (T), and a toggleable Minimap (M).
- **Discovery Guidance**: Built-in compass to track nearest undiscovered documents.
- **Memory Shrines**: Regional shrines for resurfacing old research and rediscovering insights.
- **Gems & Spaced Repetition**: Capture insights/questions and review them using SM-2 logic.
- **Daily Quests**: Simple daily tasks to keep research habits active and engaging.
- **Read Aloud (TTS)**: Built-in text-to-speech for dual-channel learning reinforcement.
- **Reflective Integration**: Guided learning objectives and reflective questions for each document.
- **Rediscovery Quests**: Automated prompts to revisit older research and combat forgetting.
- **Focus Mode**: Distraction-free reading UI for deep immersion.
- **Search & Filters**: Comprehensive search, category filters, and curated research trails.
- **Local Persistence**: All progress, notes, and gems saved in `localStorage`.
- **Manifest Import**: Tools for validating links and importing metadata from CSV.

## Learn More

See `docs/learning-enhancements.md` for the current learning design direction, low-cognitive-load research features, and the next roadmap.
See `docs/manifest-workflow.md` for validating public links and regenerating the manifest from a CSV export.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Validate Research Links

```bash
npm run validate:manifest
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

## Manifest Import

To regenerate the atlas from a Google Sheet or Drive metadata CSV:

```bash
npm run import:manifest -- docs/research-manifest-template.csv
```

Review the generated diff, then run `npm run validate:manifest` and `npm run build`.
