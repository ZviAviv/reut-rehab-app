# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reut Rehab Companion — a patient-facing web app for Reut Rehabilitation Hospital (בית החולים רעות). It guides patients through six stages of their rehab journey, from pre-admission through post-discharge. Originally exported from Google AI Studio. All UI text is in Hebrew; the layout is RTL.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server on port 3000
- `npm run build` — production build
- `npm run preview` — preview production build

There are no lint or test scripts.

## Architecture

**Single-page React 19 app** using Vite, TypeScript, and Tailwind CSS (loaded via CDN in `index.html`). No router — navigation is managed entirely through React state in `App.tsx`.

### Key files

- **`App.tsx`** (~2500 lines) — contains the entire application: the main `App` component, all views/tabs, inline sub-components (e.g. `TeamMemberCard`, `WhoToContactView`), and inline mock data for team members, other patients, and exercises. The `Tab` and `InfoSubView` union types are also defined here (not in `types.ts`).
- **`types.ts`** — shared TypeScript types: `AppStage` enum (6 rehab stages), `ChecklistItem`, `ScheduleItem`, `TreatmentSummary`, `Notification`, `FAQItem`.
- **`constants.tsx`** — mock data keyed by `AppStage`: `STAGES` (ordered array of all 6 stages), `MOCK_CHECKLIST`, `MOCK_SCHEDULE`, `MOCK_FAQ`, `MOCK_NOTIFICATIONS`.
- **`components/`** — only two small extracted components:
  - `StatusProgress.tsx` — horizontal progress stepper for the 6 stages
  - `WidgetCard.tsx` — reusable card wrapper with title/icon/action header
  - The sidebar (mobile overlay + desktop fixed) lives inline in `App.tsx`, not as a separate file.

### Navigation model

Three levels of navigation state in `App`:
1. **`currentStage: AppStage`** — which rehab phase the patient is in (drives checklist, FAQ, and conditional content)
2. **`activeTab: Tab`** — which main view is shown (`'home' | 'info' | 'medical' | 'notebook' | 'exercises' | 'goals' | 'checklist' | 'faq' | 'treatment-summary'`)
3. **`infoSubView: InfoSubView`** — deep sub-navigation within the "info" tab (30+ sub-views for hospital info, team, ward, rights, etc.)

### Styling

- Tailwind CSS via CDN `<script>` tag (not installed as a dependency)
- Font: "Assistant" from Google Fonts
- Design language: rounded cards (`rounded-2xl`/`rounded-3xl`), blue accent palette, soft shadows

### Path aliases

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

### Source layout

All source files are at the project root — `App.tsx`, `index.tsx`, `types.ts`, `constants.tsx`, and `index.html` sit alongside `vite.config.ts`. There is no `src/` directory.

### Dual-mode HTML

`index.html` uses an `importmap` to load React from esm.sh CDN, which means the app can run without Vite (open `index.html` directly in a browser). Vite is still required for the full dev experience (HMR, path aliases, env injection).

## Development notes

- The app is a prototype/low-fidelity demo — data is all mocked inline, there is no backend or API integration yet.
- `vite.config.ts` injects `GEMINI_API_KEY` from `.env.local` as `process.env.API_KEY` / `process.env.GEMINI_API_KEY`. The key is not currently used but the config expects it.
- `App.tsx` is monolithic by design (AI Studio export). When adding features, consider whether to extract into `components/` or keep inline depending on complexity.
- RTL layout: `<html lang="he" dir="rtl">` — keep this in mind when using directional CSS (e.g. `right`/`left`, `translate-x`).
