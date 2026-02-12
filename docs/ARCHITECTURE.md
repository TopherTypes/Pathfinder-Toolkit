# Architecture Overview

## App style

- Pure static web app (`HTML/CSS/JS`) with no build tooling.
- Hash-based routing for compatibility with simple static hosting.
- Bootstrap 5 loaded via CDN for lightweight UI components.

## Data model and schema versioning

State uses a single document persisted in localStorage with a root-level `schemaVersion`.

Core model factories are defined in `app/scripts/models.js`:
- Campaign
- Session
- Creature
- Item
- PrintQueueEntry

Versioning strategy:
1. Read persisted state.
2. Compare `schemaVersion` with current app version.
3. Apply migrations when needed (future enhancement).
4. Save migrated result back to storage.

## Storage approach

Current approach:
- Local-first `localStorage` via `app/scripts/storage.js`.
- Single storage key (`pf_toolkit_state_v1`) for simple export/import.
- JSON export/import for portability and backups.

Future path:
- Move large state slices (e.g., many statblocks) to IndexedDB while retaining top-level settings in localStorage.

## Routing strategy

- Router in `app/scripts/router.js` reads `window.location.hash`.
- Valid routes map to simple view renderers in `app/scripts/ui.js`.
- Route changes trigger full view re-render of main content region.

## Printing strategy

- Print templates generated in `app/scripts/print.js`.
- Queue assembly and on-screen print preview rendered in Print Queue view.
- `app/styles/print.css` defines:
  - A4 page size and margins
  - card dimensions and spacing
  - cut line/crop markers
  - optional `hide-cut-lines` body class to suppress trim markers

This keeps print behavior deterministic for at-table physical prep.
