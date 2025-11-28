# Saturno Hub — Starter

This repo gives you a clean baseline to **merge all the scattered frontends** into one Command Center and auto‑deploy to GitHub Pages.

## Quick start
```bash
npm i
npm run dev      # local preview
npm run build    # static build to /dist
```

## Deploy (GitHub Pages via Actions)
1. Push this repo to `gabosaturno11/AI-Hub` (or any repo).
2. Ensure GitHub Pages is enabled for `gh-pages` environment (Actions creates it).
3. On push to `main`, the workflow builds and deploys `/dist`.

## Import legacy UIs (Perplexity zip, etc.)
Put your legacy HTML files into `/legacy` and run:
```bash
npm run merge:legacy
```
This creates `/public/legacy/manifest.json` and splits each HTML into `head`, `body`, `styles`, `scripts`. The Command Center can load these dynamically (future: mount as tabs).

## Data contracts (JSON)
- `MovementDNA.schema.json`
- `Timeline.schema.json`
- `SMCal.schema.json`
- `Comments.schema.json`

These mirror the Command Center localStorage structures. Keep ports to agents consistent.

## CLI shorthands (same as the palette stubs)
```bash
npm run deploy-hub
npm run hub-live
npm run hub-github
```

## Gemini pass‑through (Video → Markers → Outline)
1. In Assets → Video Analyzer, export `video_markers.json`.
2. Feed to Gemini with a prompt like:
```
System: You are an assistant that turns screen‑recording markers into TODOs and a coherent outline.
User: Here are time‑stamped markers in JSON. Return:
  - High‑level outline (H1/H2)
  - Actionable TODOs grouped by area (AI‑Hub, SM Lab, Writing)
  - Blockers & missing assets
JSON:
<paste video_markers.json>
```
