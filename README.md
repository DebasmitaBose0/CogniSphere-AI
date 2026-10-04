# 🌌 CogniSphere AI — Spatial 3D Neural Learning Platform

[![NSOC 2026](https://img.shields.io/badge/NSOC-2026%20Selected%20Project-00f0ff?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://github.com/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-10b981?style=for-the-badge&logo=github)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Welcome to NSOC 2026 (Nexus Spring of Code)!** 🎉  
> Hi everyone! I am a **Project Administrator (PA)** for **NSOC 2026**. **CogniSphere AI** is officially open for open-source contributions. Whether you want to squash bugs, optimize 3D WebGL rendering, enhance the AI study workflow, or polish UI/UX responsiveness—**all contributors are warmly welcomed!** 🚀  
> Check out the [NSOC Issues Catalog](NSOC_ISSUES_CATALOG.md) to claim tasks and earn points!

---

## 🧭 Table of Contents
- [About CogniSphere AI](#-about-cognisphere-ai)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started Locally](#-getting-started-locally)
- [NSOC 2026 Scoring System](#-nsoc-2026-scoring-system)
- [How to Find Issues & Create PRs](#-how-to-find-issues--create-prs)
- [Curated Issue Catalog (12 Ready Tasks)](#-curated-issue-catalog)
- [Git Workflow for NSOC 2026](#-git-workflow-for-nsoc-2026)
- [Code Conventions](#-code-conventions)
- [Project Administrator (PA)](#-project-administrator-pa)

---

## 💡 About CogniSphere AI

**CogniSphere AI** is a next-generation, futuristic spatial study companion engineered for Computer Science and STEM students. Unlike typical flat study apps, CogniSphere combines **Three.js WebGL graphics**, **real-time 3D spatial interaction ("I can touch it")**, active recall testing, and grounded AI synthesis to transform raw lecture notes and textbooks into an immersive knowledge universe.

---

## ✨ Key Features

1. **🌐 Interactive 3D Rotating Study Sphere (Three.js):**
   - 360-degree tactile mouse drag and touch rotation.
   - Orbiting holographic 3D Open Codex books displaying real information theory formulas ($H(X) = -\sum P(x) \log_2 P(x)$) and ascending particle streams.
   - Floating discipline nodes: *Quantum Systems*, *Neural Genetics*, *Mastery Mortarboard*, *Cloud Architecture*, and *Sacred Polyhedra*.
   - Smooth camera interpolation and subject inspection HUD.

2. **📊 Comprehensive 11-Widget Home Dashboard:**
   - **Student Profile:** Dynamic student name customization with streak counter (`🔥 7 Days Active`) and level progression.
   - **Overall Progress Percentage:** Luminous SVG radial progress meter.
   - **Today's Study Targets:** Interactive daily objectives checklist with confetti rewards and goal adder.
   - **Floating 3D Subject Cards:** Tactile physics-based cards with mouse parallax tilt.
   - **Quick Actions Dock:** 1-click launchers for all study workspaces.
   - **Subject Topics Syllabus:** Filterable curriculum breakdown by subject and difficulty.
   - **Study Notes & Scratchpad:** Real-time note scratchpad with auto-save to `localStorage`.
   - **Pomodoro Study Timer:** Deep work interval timer (25m Focus / 5m Break / 15m Long Break) with Web Audio sound synthesis.
   - **Interactive Quiz System:** Active recall challenges with adaptive feedback.
   - **Weekly Study Calendar:** Day-by-day scheduler and upcoming exam deadlines.
   - **Progress Analytics:** Daily focus hours bar chart and topic mastery metrics.

3. **🧠 AI Synthesis & Spatial Flashcards:**
   - Multi-tier structured summaries with key takeaways and formulas.
   - 3D flip flashcards for spaced repetition.
   - Interactive SVG Knowledge Graph concept visualizer.
   - Socratic Neural AI Chat Companion.

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 18 (Functional Components, Hooks) |
| **Language** | TypeScript 5.7+ (Strict Mode, 100% typed) |
| **Build & Dev Tool** | Vite 6 |
| **3D Graphics & WebGL** | Three.js (`@types/three`) |
| **Animations & Spatial UI** | Framer Motion (Spring physics, Parallax) |
| **Styling** | Vanilla CSS + TailwindCSS |
| **Audio** | Native HTML5 Web Audio API (Zero bulky sound files) |
| **Cloud & Backend** | Supabase (PostgreSQL + RLS) with LocalStorage fallback |
| **Icons** | Lucide React |

---

## 🚀 Getting Started Locally

Follow these quick steps to get the development environment running on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher) or `pnpm` / `yarn`
- [Git](https://git-scm.com/)

### 1. Fork and Clone
```bash
# Clone your forked repository
git clone https://github.com/<your-username>/cognisphere-ai.git

# Navigate into the project folder
cd cognisphere-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
If you wish to test Supabase cloud synchronization or Gemini AI API keys, copy `.env.example`:
```bash
cp .env.example .env
```
*(The app works completely out of the box with offline local storage even without API keys!)*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` and enjoy!

### 5. Validate TypeScript Build
Before opening a PR, always verify that there are zero TypeScript errors:
```bash
npm run build
```

---

## 🏆 NSOC 2026 Scoring System

In **Nexus Spring of Code (NSOC 2026)**, every merged Pull Request earns contributors points towards the leaderboard and helps the PA maintain a stellar repository score:

| Difficulty Tier | GitHub Label | Points Awarded | Examples |
|---|---|---|---|
| 🟢 **Level 1** | `level-1`, `good first issue` | **10 Points** | Mobile responsive fixes, sound persistence, UI touch-ups |
| 🟡 **Level 2** | `level-2`, `enhancement` | **25 Points** | Note export to Markdown, flashcard shuffle, visibility pauses |
| 🔴 **Level 3** | `level-3`, `advanced` | **50 Points** | Three.js WebGL optimizations, local Ollama integration, test suites |

---

## 🔍 How to Find Issues & Create PRs

### 1. Browse the Ready-to-Claim Catalog
We have created a dedicated [NSOC_ISSUES_CATALOG.md](NSOC_ISSUES_CATALOG.md) with **12 pre-structured issues** detailing the exact bug, affected file path, and expected outcome.

### 2. Browse the GitHub Issues Tab
Check out the **[Issues](../../issues)** tab in the repository:
- Look for labels:
  - `level-1` / `good first issue` — Great for getting your first NSOC points.
  - `level-2` — Feature enhancements and bug fixes.
  - `level-3` — Deep architectural and performance tasks.
  - `nsoc-2026` — Official tracked tasks for the program.

### 3. Found a Bug or Want to Propose an Improvement?
- If you find an issue that hasn't been reported yet, feel free to **Open a New Issue** using our templates!
- Comment on the issue: *"Hi PA @maintainer, I would like to work on this for NSOC 2026. Please assign it to me."*
- Once assigned by the PA, you can start working on it!

---

## 🎯 Curated Issue Catalog

Contributors can claim any of these tasks from [NSOC_ISSUES_CATALOG.md](NSOC_ISSUES_CATALOG.md):

| ID | Difficulty | Points | Task Title | Affected Area |
|---|---|---|---|---|
| **#01** | 🟢 Level 1 | **10 pts** | Mobile Responsive Padding & Overflow on Small Screens (<380px) | `HomePageView.tsx`, `Navbar.tsx` |
| **#02** | 🟢 Level 1 | **10 pts** | Audio Mute Preference Persistence Across Browser Refreshes | `soundFx.ts` |
| **#03** | 🟢 Level 1 | **10 pts** | Confirmation Dialog Before Clearing Study Scratchpad | `HomePageView.tsx` |
| **#04** | 🟢 Level 1 | **10 pts** | Comprehensive JSDoc Comments to Spatial Scene Manager | `SpatialSceneManager.ts` |
| **#05** | 🟡 Level 2 | **25 pts** | Export Study Summary & Notes to Markdown (`.md`) & Print | `FuturisticSummaryView.tsx` |
| **#06** | 🟡 Level 2 | **25 pts** | Flashcard Mastery Filtering & Shuffle Deck Mode | `FuturisticFlashcardView.tsx` |
| **#07** | 🟡 Level 2 | **25 pts** | Auto Pause Three.js Render Loop When Tab is Hidden | `InteractiveStudySphere.tsx` |
| **#08** | 🟡 Level 2 | **25 pts** | Fill-in-the-Blank & True/False Quiz Question Types | `FuturisticQuizView.tsx` |
| **#09** | 🔴 Level 3 | **50 pts** | Local WebLLM / Ollama Offline AI Provider Support | `src/services/ai.ts` |
| **#10** | 🔴 Level 3 | **50 pts** | Adaptive LOD & WebGL Context Fallback for Low-End Devices | `InteractiveStudySphere.tsx` |
| **#11** | 🔴 Level 3 | **50 pts** | Unit & Integration Test Suite using Vitest & Testing Library | `src/lib/__tests__/` |
| **#12** | 🔴 Level 3 | **50 pts** | Anki & Quizlet Deck Export (`.apkg` / `.csv`) | `FuturisticFlashcardView.tsx` |

---

## 🌿 Git Workflow for NSOC 2026

Please adhere to standard Git open-source etiquette:

1. **Create a Feature Branch:**
   ```bash
   git checkout -b fix/issue-description
   # or
   git checkout -b feat/feature-name
   ```

2. **Make Clean, Atomic Commits:**
   ```bash
   git commit -m "fix(pomodoro): resolve timer sound playback on iOS"
   ```

3. **Keep Your Branch Updated:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Verify TypeScript & Lint:**
   ```bash
   npm run build
   ```

5. **Open a Pull Request:**
   - Link the PR to the issue: `Fixes #<issue_number>`.
   - Provide before/after screenshots or screen recordings for UI changes.
   - Mention your NSOC 2026 participant ID or details.

---

## 📜 Code Conventions

- **Clean TypeScript:** Do not use `any` unless strictly necessary. Ensure types are imported from `src/types/index.ts`.
- **Component Modularity:** Keep components reusable and styles structured using TailwindCSS and CSS variables.
- **Audio & Performance:** Always check `soundFx.getIsMuted()` before playing sounds.
- **WebGL Hygiene:** Dispose of geometries, materials, and textures in `useEffect` cleanup return functions.

---

## 👩‍💻 Project Administrator (PA)

- **Project:** CogniSphere AI
- **Program:** Nexus Spring of Code (NSOC 2026)
- **Role:** Project Administrator (PA) & Lead Maintainer
- **Welcome Message:** *“Thank you for contributing to CogniSphere AI during NSOC 2026! We believe in peer collaboration, prompt reviews, rewarding contributor points, and building cutting-edge open-source software together. Happy coding!”* 🌟

---

## 📄 License
This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
