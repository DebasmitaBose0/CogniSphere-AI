# 🏆 NSOC 2026 (Nexus Spring of Code) — Issue & Task Catalog

> **For Contributors & Project Administrators (PA):**  
> This catalog contains curated, actionable issues and bug bounties for **CogniSphere AI** during **Nexus Spring of Code (NSOC 2026)**.  
> Each task has an assigned **Difficulty Level**, **Points Value**, and **Affected Files** to help contributors earn scores on the NSOC leaderboard while helping the PA maintain a high-quality codebase!

---

## 🎯 Scoring & Difficulty Tiers

| Tier | Label | Points | Description | Ideal For |
|---|---|---|---|---|
| 🟢 **Level 1** | `level-1` / `good first issue` | **10 Points** | UI polish, CSS/mobile responsive tweaks, minor bug fixes, accessibility | First-time contributors |
| 🟡 **Level 2** | `level-2` / `enhancement` | **25 Points** | Feature modules, local storage persistence, file exports, audio preferences | Intermediate devs |
| 🔴 **Level 3** | `level-3` / `advanced` | **50 Points** | Three.js WebGL optimizations, Local AI/Ollama integrations, PWA, Test Suites | Advanced devs |

---

## 📋 Ready-to-Claim Issues

### 🟢 Level 1 Issues (10 Points Each)

#### Issue #01: `[UI/Bug]: Mobile Responsive Padding & Overflow on Small Screens (<380px)`
- **Difficulty:** Level 1 (10 pts)
- **Labels:** `bug`, `level-1`, `good first issue`, `nsoc-2026`
- **Affected Files:** `src/components/home/HomePageView.tsx`, `src/components/layout/Navbar.tsx`
- **Problem:** On very compact mobile viewports (e.g. iPhone SE / 375px), the discipline filter pills in `HomePageView.tsx` and the Pomodoro timer mode switcher wrap tightly or cause minor horizontal scroll overflow.
- **Expected Outcome:** Add `flex-wrap` with appropriate padding, hide or scroll horizontal pills smoothly with `no-scrollbar`, ensuring zero horizontal overflow on screens down to 320px width.

---

#### Issue #02: `[Bug]: Audio Mute Preference Not Persisted Across Browser Refreshes`
- **Difficulty:** Level 1 (10 pts)
- **Labels:** `bug`, `level-1`, `good first issue`, `nsoc-2026`
- **Affected Files:** `src/lib/soundFx.ts`, `src/components/layout/Navbar.tsx`
- **Problem:** Currently, when the user toggles the sound button in the Navbar, `isMuted` is toggled in memory. If the page is refreshed, the sound defaults back to unmuted.
- **Expected Outcome:** Store the mute preference in `localStorage.getItem('cognisphere_sound_muted')` so the user's preference is remembered across sessions.

---

#### Issue #03: `[Feature]: Add Confirmation Dialog Before Clearing Study Scratchpad`
- **Difficulty:** Level 1 (10 pts)
- **Labels:** `enhancement`, `level-1`, `good first issue`, `nsoc-2026`
- **Affected Files:** `src/components/home/HomePageView.tsx`
- **Problem:** Clicking "Clear Scratchpad" immediately erases the student's study notes without a warning, which could cause accidental data loss.
- **Expected Outcome:** Add a subtle inline confirmation modal or `window.confirm` check ("Are you sure you want to clear your scratchpad notes?") before clearing.

---

#### Issue #04: `[Docs]: Add Comprehensive JSDoc Comments to Three.js Spatial Scene Manager`
- **Difficulty:** Level 1 (10 pts)
- **Labels:** `documentation`, `level-1`, `nsoc-2026`
- **Affected Files:** `src/components/spatial/SpatialSceneManager.ts`, `src/components/three/InteractiveStudySphere.tsx`
- **Problem:** Some Three.js coordinate mapping and lighting functions lack JSDoc descriptions, making onboarding harder for new 3D graphics contributors.
- **Expected Outcome:** Document method signatures, parameters, coordinate ranges, and disposal guidelines with clean JSDoc syntax.

---

### 🟡 Level 2 Issues (25 Points Each)

#### Issue #05: `[Feature]: Export Study Summary & Notes to Markdown (.md) and Printable View`
- **Difficulty:** Level 2 (25 pts)
- **Labels:** `enhancement`, `level-2`, `nsoc-2026`
- **Affected Files:** `src/components/summary/FuturisticSummaryView.tsx`, `src/components/home/HomePageView.tsx`
- **Problem:** Students currently cannot download their AI-generated summaries or custom scratchpad notes to their local machine as Markdown or PDF.
- **Expected Outcome:** Add an "Export as .md" button that triggers a browser file download using `Blob` and `URL.createObjectURL`, plus a CSS `@media print` rule for clean printing.

---

#### Issue #06: `[Feature]: Flashcard Mastery Filtering & Shuffle Deck Mode`
- **Difficulty:** Level 2 (25 pts)
- **Labels:** `enhancement`, `level-2`, `nsoc-2026`
- **Affected Files:** `src/components/flashcards/FuturisticFlashcardView.tsx`
- **Problem:** In 3D Flashcards, cards currently appear in a static linear order and cannot be filtered to review only "Still Learning" (unmastered) cards.
- **Expected Outcome:** Add a "Shuffle Deck" button using Fisher-Yates algorithm, and a filter toggle: `[All Cards | Mastered | Needs Practice]`.

---

#### Issue #07: `[Bug/Perf]: Automatic Pause of Three.js Render Loop When Tab is Hidden (Page Visibility API)`
- **Difficulty:** Level 2 (25 pts)
- **Labels:** `performance`, `bug`, `level-2`, `threejs`, `nsoc-2026`
- **Affected Files:** `src/components/three/InteractiveStudySphere.tsx`, `src/components/spatial/SpatialSceneManager.ts`
- **Problem:** The WebGL requestAnimationFrame loop continues calculating mesh rotations even when the student switches to another browser tab, consuming background GPU/battery.
- **Expected Outcome:** Attach a `document.addEventListener('visibilitychange')` listener to pause the render loop when `document.hidden === true` and resume when visible.

---

#### Issue #08: `[Feature]: Add Fill-in-the-Blank and Multiple Choice Filtering in Quiz System`
- **Difficulty:** Level 2 (25 pts)
- **Labels:** `enhancement`, `level-2`, `quiz`, `nsoc-2026`
- **Affected Files:** `src/components/quiz/FuturisticQuizView.tsx`
- **Problem:** The active recall quiz currently only presents 4-option multiple-choice questions.
- **Expected Outcome:** Introduce an adaptive Question type for True/False and Fill-in-the-blank with immediate answer normalization and feedback.

---

### 🔴 Level 3 Issues (50 Points Each)

#### Issue #09: `[Feature]: Local WebLLM / Ollama Offline AI Provider Support`
- **Difficulty:** Level 3 (50 pts)
- **Labels:** `advanced`, `level-3`, `ai`, `nsoc-2026`
- **Affected Files:** `src/services/ai.ts`, `src/components/study/FuturisticUploadPedestal.tsx`
- **Problem:** For students studying with sensitive or confidential notes, sending text to external cloud APIs might not be desirable.
- **Expected Outcome:** Add an optional settings toggle to connect to `http://localhost:11434` (Ollama local API) or `@mlc-ai/web-llm` for 100% on-device private AI summarization and quiz generation.

---

#### Issue #10: `[Performance]: Adaptive Level-of-Detail (LOD) & WebGL Context Fallback for Low-End Devices`
- **Difficulty:** Level 3 (50 pts)
- **Labels:** `performance`, `level-3`, `threejs`, `nsoc-2026`
- **Affected Files:** `src/components/three/InteractiveStudySphere.tsx`, `src/components/spatial/SpatialCanvas.tsx`
- **Problem:** If a student is using a low-end Chromebook or device without hardware WebGL acceleration, Three.js may experience frame drops or fail silently.
- **Expected Outcome:** Implement dynamic FPS monitoring (measure delta between frames); if FPS < 30 for 3 consecutive seconds, automatically reduce particle count from 800 to 200 and disable post-processing. Provide a clean CSS 2.5D fallback if WebGL is unavailable.

---

#### Issue #11: `[Testing]: Unit & Integration Test Suite using Vitest & React Testing Library`
- **Difficulty:** Level 3 (50 pts)
- **Labels:** `testing`, `level-3`, `nsoc-2026`
- **Affected Files:** `package.json`, `src/lib/__tests__/`, `src/components/__tests__/`
- **Problem:** The project currently lacks automated unit tests for critical business logic (word counting, Pomodoro timer math, active recall scoring, and storage serialization).
- **Expected Outcome:** Setup Vitest + `@testing-library/react`, write comprehensive test suites for `src/lib/utils.ts`, `src/lib/soundFx.ts`, and `src/services/storage.ts` with >80% code coverage.

---

#### Issue #12: `[Feature]: Anki & Quizlet Deck Export (.apkg / .csv)`
- **Difficulty:** Level 3 (50 pts)
- **Labels:** `enhancement`, `level-3`, `flashcards`, `nsoc-2026`
- **Affected Files:** `src/components/flashcards/FuturisticFlashcardView.tsx`, `src/lib/exportAnki.ts`
- **Problem:** Medical, law, and CS students frequently use Anki for spaced repetition alongside their study tools.
- **Expected Outcome:** Implement a parser that transforms CogniSphere flashcards into downloadable Anki-compatible `.csv` and formatted TSV files with front/back tags.

---

## 📌 How to Claim an Issue (Step-by-Step)

1. Find an issue in the list above or on the GitHub Issues tab.
2. Comment on the issue:
   ```markdown
   Hello PA! I would like to work on this issue for NSOC 2026.
   - NSOC Participant Name: [Your Name]
   - Expected Completion Time: [e.g., 2-3 days]
   Please assign it to me.
   ```
3. Once assigned by the **Project Administrator (PA)**, follow the instructions in [CONTRIBUTING.md](CONTRIBUTING.md).
4. After your PR is reviewed and merged, the PA will award your points (**10 pts**, **25 pts**, or **50 pts**) on the official **NSOC 2026** platform!
