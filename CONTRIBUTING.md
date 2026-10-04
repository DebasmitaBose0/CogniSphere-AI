# 🤝 Contributing to CogniSphere AI (NSOC 2026)

First off, welcome to **CogniSphere AI**! 🎉  
We are thrilled you want to contribute as part of **NSOC 2026 (Nexus Spring of Code)**.

As a **Project Administrator (PA)** for NSOC 2026, I am dedicated to reviewing your Pull Requests promptly, providing friendly feedback, awarding your points, and helping you climb the contributor leaderboard!

---

## 🏆 NSOC 2026 Scoring System

In Nexus Spring of Code 2026, tasks are categorized into 3 difficulty tiers with corresponding point rewards:

| Level | Label | Points Awarded | Task Types |
|---|---|---|---|
| 🟢 **Level 1** | `level-1`, `good first issue` | **10 Points** | UI/CSS responsiveness, audio settings, small bug fixes, documentation |
| 🟡 **Level 2** | `level-2`, `enhancement` | **25 Points** | Features, local storage persistence, export formats, quiz types |
| 🔴 **Level 3** | `level-3`, `advanced` | **50 Points** | Three.js WebGL optimization, local AI providers, test suites |

> **How Points Are Credited:**  
> Once your PR is reviewed and merged into `main`, the **PA** will apply the `nsoc-accepted` label and credit your score on the official **NSOC 2026** platform!

---

## 📌 How to Find Issues to Work On

Contributors can find tasks in three ways:

1. **Browse our Curated Catalog:**  
   Check out the [NSOC_ISSUES_CATALOG.md](NSOC_ISSUES_CATALOG.md) which contains 12 pre-defined issues ready to claim with affected file paths and expected outcomes.

2. **Browse Existing GitHub Issues:**
   - Go to the **Issues** tab.
   - Filter by labels: `level-1`, `level-2`, `level-3`, `good first issue`, `bug`, `nsoc-2026`.

3. **Find a Bug on Your Own:**
   - Run the project locally (`npm run dev`).
   - Test different pages, edge cases, responsive screen sizes, or Three.js 3D interactions.
   - If you encounter a glitch or unhandled edge case, **Open an Issue** using our Bug Report template.

4. **Propose a New Feature:**
   - Open a feature request issue describing the enhancement (e.g., Anki deck export, local Ollama integration, dark mode fine-tuning).

---

## 🚦 Contribution Rules

1. **Get Assigned First:**  
   Always comment on an open issue:  
   *"Hi PA @maintainer, I would like to work on this issue for NSOC 2026. Please assign it to me."*  
   Wait for the assignment before opening a PR to avoid duplicate work.
2. **One Issue per PR:**  
   Keep your pull request focused on solving that specific issue.
3. **No Breaking TypeScript:**  
   Always ensure `npm run build` succeeds with zero errors before pushing.

---

## 🛠 Pull Request (PR) Checklist

Before submitting your PR:
- [ ] Fork the repository and create your branch from `main`.
- [ ] Run `npm install` and ensure code runs cleanly.
- [ ] Test your changes in the browser (light & dark mode, mobile & desktop).
- [ ] Run `npm run build` to confirm there are no type or bundle errors.
- [ ] Add screenshots or GIFs in the PR description for visual/UI changes.
- [ ] Reference the issue: `Fixes #<issue_number>`.

---

## 💬 Need Help?
Feel free to ask questions inside the issue comments or reach out to the **PA** in the NSOC 2026 community channel. Happy hacking! 🚀
