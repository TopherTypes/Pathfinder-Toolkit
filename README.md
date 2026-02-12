# Table-Ready (Pathfinder Toolkit)

Table-Ready is a local-first Pathfinder 1e GM preparation tool designed for **in-person play** and **printable outputs**.

This v1 scaffold focuses on:
- Guided prep flow (checklist + wizard stub)
- Quick entry stubs for creatures, items, and sessions
- Print queue with A4-ready templates and cut lines
- Local JSON export/import

## Run locally

No build step is required.

- Option 1: open `app/index.html` directly in your browser.
- Option 2 (recommended for some browser module/CORS behaviors):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/app/`.


## GitHub Pages deployment

This repository is compatible with GitHub Pages without a build step:
- publish from the repository root (for example: `main`/`docs` or `main`/`root` depending on your Pages setting)
- root `index.html` redirects to `app/index.html`
- the app itself remains organized under `app/`

If you prefer, you can also make `app/index.html` the direct entry point later, but it is **not required** for GitHub Pages compatibility.

## Data storage

- App state is stored in `localStorage` under `pf_toolkit_state_v1`.
- Includes `schemaVersion` for future migrations.
- Use **Settings → Export JSON / Import JSON** for backups and transfers.

## Printing guidance

- Print styles target **A4**.
- For best results in the browser print dialog:
  - Paper size: A4
  - Scale: 100%
  - Disable browser headers/footers
- Use **Print Queue → Toggle Cut Lines** to enable/disable card trim markers.

## Repository structure

- `app/` static web app (HTML/CSS/JS only)
- `docs/` architecture and roadmap notes
- `examples/` sample import-friendly content

## Roadmap snapshot

### Now
- Static shell with route-based views
- localStorage state with schemaVersion
- basic print queue templates (creature/item/session)

### Next
- Better guided prep wizard flows and checklist customization
- Campaign timeline and progressive prep milestones
- Multi-card pagination improvements for print output

### Later
- AoN URL parsing and extraction helpers
- Optional cloud sync (e.g., Google Drive)
