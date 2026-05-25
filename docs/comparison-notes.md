# Research Atlas vs. Research Gems: A Cognitive Science Perspective

This document provides a balanced, well-researched view of both apps, drawing on the Research Gems codebase, documentation, and memory-science literature to evaluate their strengths, weaknesses, and potential for integration.

## Research Atlas – Strengths & Weaknesses

Research Atlas aims to turn your personal knowledge base into a game-like map. It uses categories such as **Health Highlands**, **Mind Forest**, **Family Grove**, and **Faith Chapel**, and you wander with WASD to “discover” docs. Each scroll or book opens a modal with tags, summary, and a link. Progress is tracked as “X / 42 documents discovered”. It’s a fun way to explore a large set of PDFs and Google Docs and gives a sense of adventure.

On the downside, Research Atlas doesn’t yet integrate memory-science principles. Working memory is a limited workspace; its contents fade quickly and performance drops when we juggle too many demands. Complex tasks or noisy environments make it harder to consolidate new knowledge. The map interface looks cool but requires navigating through many icons, which can be cognitively taxing, especially for someone with ADHD. There is no built-in spaced repetition, no audio or highlighting to aid comprehension, and no reflective prompts.

### SWOT snapshot for Research Atlas

| Aspect | Key points |
| :--- | :--- |
| **Strengths** | Immersive map makes exploration playful; clear regional themes (Health, Mind, Family, Faith, Tech, Life, Archive); simple “discover” mechanic; supports PDFs and Google Docs; progress tracker. |
| **Weaknesses** | No built-in reading aids (text-to-speech, highlighting); navigating a grid of icons may overload working memory; no spaced-repetition or recall prompts; limited accessibility (keyboard navigation not always reliable); fixed document list requires manual updates. |
| **Opportunities** | Add screen-reader with synchronized highlighting; offer distraction-free reading view and key-passage summaries; schedule spaced-repetition reminders so old research resurfaces; include personal notes and quick-recap questions to encourage retrieval; integrate cross-category recommendations; import Google Drive folders automatically. |
| **Threats** | Map complexity could discourage regular use; as the document library grows the interface may become unwieldy; if open-source, security of personal data must be considered; could be superseded by apps with stronger memory-integration features. |

---

## Research Gems – Strengths & Weaknesses

Research Gems is a local-first React/Vite app for rediscovering and applying ideas from research docs. According to its README, it is designed around active recall, spaced repetition and reflection. Users add documents in `src/data/researchDocuments.ts` and “gems” (insights or questions) in `researchGems.ts`, then review them at intervals. The spaced-repetition algorithm mimics Anki: rating a gem as “Forgot” schedules a review tomorrow, “Hard” in two days, “Good” moderately later, and “Easy” pushes it further into the future. This design aligns well with cognitive science: revisiting material at increasing intervals helps transfer it into long-term memory, and the app explicitly encourages active recall and reflection rather than passive reading.

The enhancement plan lists ambitious goals: importing docs directly from Google Drive, automatically extracting gems from long reports, cross-referencing documents, and adding reflective prompts and progress tracking. At present, though, many of these features are not implemented. The user must manually add each document and gem; there is no visual exploration mode, and little support for scanning long PDFs or highlighting key passages. The interface is text-heavy and may feel dry without the map-based engagement of Research Atlas. The existing spaced-repetition scheduler also assumes simple rating (“Forgot”, “Hard”, “Good”, “Easy”) which might not capture nuance.

### SWOT snapshot for Research Gems

| Aspect | Key points |
| :--- | :--- |
| **Strengths** | Emphasises active recall and spaced repetition; local-first (works offline, data stays on your machine); simple rating system schedules reviews intelligently; reflective prompts encourage deeper integration; codebase is documented and easy to extend; enhancement plan proposes Drive import and gem extraction. |
| **Weaknesses** | Requires manual entry of documents and “gems”; no map or visual browsing; lacks screen-reading or highlighting features; review intervals are preset and may not adapt to individual difficulty; limited cross-referencing between documents; code currently uses placeholders and may break if links are missing. |
| **Opportunities** | Implement Google Drive import and automatic gem extraction; link gems to their source documents and show them in context; add speech-synthesis with follow-along highlighting; enrich the rating system with confidence sliders or self-generated questions; integrate a simple map or card-gallery for browsing; allow sharing of gems or tags with others. |
| **Threats** | Manual data entry may discourage adoption; if not maintained, the gem list can get stale; other tools (Anki, Notion, Obsidian plugins) already offer spaced repetition and may compete; complexity of new features (Drive import, NLP extraction) could introduce bugs or performance issues. |

---

## Reflections and Advice

Both projects have merit and complement each other: **Research Atlas excels at discoverability** and playful exploration, while **Research Gems shines at retention** and active recall. Together they could offer a comprehensive knowledge system.

Drawing on cognitive-science findings, a unified approach might look like this:

1. **Dual-Channel Discovery**: Use the Atlas interface as a front door for discovery. Add a simple “read aloud” button and highlight text as it’s spoken; this dual-channel presentation supports memory. Summarise documents with auto-extracted key passages and allow a distraction-free reading mode to reduce cognitive load.
2. **Externalizing Memory**: When a document is opened, let users capture gems (questions, insights, quotations). Send these to the Research Gems engine for spaced-repetition review. This externalises prospective memory tasks and provides the external cues that people with ADHD need.
3. **Retrieval Practice**: Surface old research through spaced-repetition notifications and “random rediscovery quests.” Prompt the user to recall the key ideas before re-reading; this retrieval practice strengthens memory.
4. **Reflective Integration**: Add small reflective questions after reading: “How might this apply to your life?” or “What will you do differently?” These self-generated questions integrate knowledge with personal experience and reduce the tendency to forget appointments and intentions.

Ultimately, the strength of these tools lies in blending imagination with science — using the joy of exploration to draw you in and the rigour of memory research to help the knowledge stick.
