Original prompt: Build and push a public Vite/React/TypeScript app called Research Atlas to joshualparris/ResearchAtlas. It should be a fantasy map for exploring public deep research PDFs and Google Docs, with movement, inspection, search, filters, localStorage discovery, list view, map view, and Vercel deployment instructions.

## Progress

- Created the Vite/React/TypeScript project structure.
- Added a static research manifest with 56 starter documents across Health, Mind, Family, Faith, Tech, Life, and Archive regions.
- Implemented map movement, document proximity, inspection panel, discovery persistence, search, category filters, region legend, map view, list view, touch controls, and test hooks.
- Ran `npm install` and confirmed `npm run build` succeeds.
- Verified gameplay with the Playwright web-game client and inspected the screenshot/state output.
- Verified list view, search, Tech category filter, inspect, Escape close, slash focus, and console cleanliness with a browser check.

## TODO

- Replace placeholder public Drive URLs with exact public document URLs when available.
- Consider a V2 generator that imports public Drive metadata and rewrites `researchManifest.ts`.
