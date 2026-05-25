# Research Atlas Learning Enhancements

This document explains the current learning-focused improvements and the next roadmap for low-cognitive-load research discovery.

## New App Improvements

- **Gems & Spaced Repetition**: Learners can capture "Gems" (insights, questions, quotes) for each document. A built-in scheduler (SM-2 logic) suggests reviews to strengthen long-term memory.
- **Read Aloud (TTS)**: A "Listen" feature supports dual-channel learning (visual + auditory) which aids comprehension and reduces cognitive load.
- **Rediscovery Quests**: The app identifies "stale" discoveries (docs not viewed for 30+ days) and prompts learners to revisit them.
- **Reflective Integration**: Documents now include randomized reflective questions to encourage active recall and personal application.
- **Daily check-in**: A simple self-reflection prompt in the sidebar supports physical, mental, and spiritual awareness.
- **Light/Dark Mode**: Comprehensive theming supports better accessibility and comfort during deep reading sessions.
- **Local persistence**: Gems, check-ins, view history, and notes are all stored in `localStorage` for a stable, offline-first experience.

## Learning Design Goals

The Research Atlas app is moving beyond a static library and toward a research companion with features that support:

- low-cognitive-load discovery
- spaced review and rediscovery
- quick reflection and journaling
- focused reading habits without overwhelming the learner
- progressive mastery of research topics over time

## Proposed Enhancements

These features are aligned with the current app direction and can be added iteratively:

1. **Focus mode**
   - hide the map and sidebar when a document is open
   - show only the document summary, recommended next step, and a quick note field

2. **Inline reading guide**
   - provide one-sentence goals for each document
   - surface the most relevant tags and takeaways

3. **Notes and journal**
   - add a lightweight note-taking panel on each document
   - let learners capture one insight, one question, and one action

4. **Spaced repetition prompts**
   - automatically suggest documents for review after 1, 7, 30, and 90 days
   - optionally add a "review log" to surface revisit history

5. **Learning progress dashboard**
   - measure discovery, review cycles, and personal check-ins
   - show simple milestones such as "10 docs revisited" or "7-day streak"

6. **Accessibility and cognitive support**
   - keyboard-first navigation, large controls, and readable labels
   - clear contrast and minimal UI noise for neurodivergent-friendly research

## How to Use These Enhancements

- Explore the map and inspect new documents.
- Use the **Daily Check-in** area to record how you feel and what kind of attention you want to bring.
- Revisit the **Ready to revisit** section for research that is due for another pass.
- Open recent docs from the sidebar to maintain momentum and reduce friction.

## Next Steps

- extend the manifest with more learning-oriented documents and summaries
- add a notes/journal feature for each research item
- build a dedicated review dashboard for spaced repetition and progress tracking
- integrate spaced-repetition logic from **Research Gems** to support active recall
- continue documenting design thinking in `docs/learning-enhancements.md`
- See [comparison-notes.md](file:///c:/Users/joshua.parris/ResearchAtlas/docs/comparison-notes.md) for a detailed SWOT analysis and cognitive science evaluation.
