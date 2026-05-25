Original prompt: Build and push a public Vite/React/TypeScript app called Research Atlas to joshualparris/ResearchAtlas. It should be a fantasy map for exploring public deep research PDFs and Google Docs, with movement, inspection, search, filters, localStorage discovery, list view, map view, and Vercel deployment instructions.

## Progress

- Created the Vite/React/TypeScript project structure.
- Added a static research manifest with 56 starter documents across Health, Mind, Family, Faith, Tech, Life, and Archive regions.
- Implemented map movement, document proximity, inspection panel, discovery persistence, search, category filters, region legend, map view, list view, touch controls, and test hooks.
- Ran `npm install` and confirmed `npm run build` succeeds.
- Verified gameplay with the Playwright web-game client and inspected the screenshot/state output.
- Verified list view, search, Tech category filter, inspect, Escape close, slash focus, and console cleanliness with a browser check.
- Replaced the starter placeholder manifest with 42 exact public Google Drive / Google Docs links supplied by Josh.
- Changed the document open action to a safe external anchor with `target="_blank"` and `rel="noopener noreferrer"`, plus an invalid-link fallback.
- Confirmed `npm run build` succeeds after the URL update.
- Verified map inspect flow with the Playwright web-game client and confirmed the rendered Open Document link uses the expected Google Docs URL with safe link attributes.
- Added and pushed focus mode, manifest import/validation tooling, bookmarks, curated research trails, and region quick travel as separate checkpoints.
- Added guided learning objectives, field-note prompts, and styled auto-saved personal insight notes for document inspection.
- Re-ran `npm run build`, `npm run validate:manifest`, and the Playwright web-game client for inspect flow and region quick travel; screenshots confirmed the guided prompt, safe document action, quick travel, and progress badge spacing.
- Implemented **Light/Dark Mode** toggle with persistent `localStorage` and system preference detection.
- Refactored styles to use a comprehensive **CSS Variable system** for easier theming and maintenance.
- Added **Gems System**: A spaced-repetition engine for capturing insights, questions, and quotations directly from documents.
- Integrated **SM-2 Spaced Repetition Logic** to schedule gem reviews and strengthen long-term retention.
- Added **Read Aloud (Text-to-Speech)** support to the document panel for dual-channel cognitive reinforcement.
- Implemented **Rediscovery Quests**: Automated prompts to revisit older research and combat the "forgetting curve."
- Added **Reflective Integration Questions**: Randomized prompts in the document panel to encourage active synthesis of research.
- Performed a **Systematic SWOT Audit** comparing Research Atlas and Research Gems to align with memory-science principles.
- Refined **Focus Mode** with a distraction-free, centered reading UI optimized for deep attention.
- Expanded the **Research Manifest** with a second wave of 40+ deep research documents across 8 new regions.
- Enlarged the **World Map** bounds to 2200x2400 to accommodate the new research modules.
- Updated the **Region Legend** and sidebar travel options to support the expanded atlas geography.
- Implemented **Map Zoom Controls**: Supports buttons (+, -, reset, fit), mouse wheel, and keyboard shortcuts (+, -, 0).
- Added **Teleportation Gates**: 16 glowing portals across major regions for instant quick travel (Hotkey: T).
- Integrated **Minimap Overlay**: A collapsible world-view with real-time player and gate markers (Hotkey: M).
- Added **Discovery Guidance (Compass)**: Tracks the nearest undiscovered document with distance and direction indicators.
- Implemented **Memory Shrines**: One shrine per major region that resurfaces older or undiscovered research.
- Upgraded **Document Panels**: Added Favourites, Revisit markers, Copy Link, and expanded metadata (Difficulty, Reading Time, Prompts).
- Implemented **In-App Reader**: Documents now open in a customizable Kindle-like panel with Preview, Summary, Memory, and Related tabs.
- Added **Reader Settings**: Persistable options for open modes (Right Drawer, Bottom, Fullscreen), themes (Light, Dark, Sepia), and font sizing (Hotkey: ,).
- Integrated **Touch Controls**: Natural one-finger map panning and two-finger pinch-to-zoom for mobile/tablet users.
- Added **Daily Quest System**: Simple, persistent daily tasks to guide exploration and retention.

## TODO

- **Journey Recap**: Generate a visual or text-based summary of the user's research journey (discovered docs, bookmarks, captured gems).
- **Dedicated Review Dashboard**: Build a full-screen interface for managing and reviewing the entire "Gems" library.
- **Accessibility Polish**: Improve keyboard-first navigation (focus trapping, skip links) and neurodivergent-friendly UI refinements.
- **Manifest Expansion**: Continue adding learning-oriented research documents and active links.
- **Link Maintenance**: Keep public Google Drive links current.
