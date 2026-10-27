# SKYNZ 2.0 — Creator Studio proof of concept

Last code update: October 26–27, 2026. Branch: `feature/personal-creator-apps`.

## What is implemented

- A **single Creator Studio page** with four integrated panels (music, video, FMG Shield, Floater).
- Development-only `/studio-preview`: an editable local Creator-page title and handle, stored only in this browser; music and video work without registering.
- Landing page button **OPEN CREATOR STUDIO PREVIEW** (development builds only).
- Authenticated `/creator-studio/:handle`: the backend must confirm the requested page belongs to the signed-in creator before displaying private tools.
- Dashboard entries **Studio** alongside individual creator pages; old external-link-only cards removed from dashboard.
- Music: algorithmic 16-step drum/bass patterns, genre presets, editable steps, local preview, WAV export.
- Video: local audio/background image, reactive visuals, preview, WebM export in compatible browsers.
- FMG Shield: protected local Ollama model selection and chat through backend routes; **not yet integrated with FMG Shield's full governance/persistent-memory architecture**.
- Floater: protected backend status display and link to the local Floater control desk; the agent console cannot be embedded because it intentionally forbids framing.

## What is NOT yet complete

- No AI song-generation model integrated into the music tool; the current algorithmic loop creator is the functional first stage.
- No native Velorn/ComfyStudio editor embedded; the browser visualizer is functional, with the editor integration outstanding.
- Floater tasks/approvals must still be entered on its own local control desk.
- No individual creator **database record** was created or minted. Registration was failing in the last local session; PostgreSQL readiness needs to be resolved for authenticated creator pages.
- No live production deployment of this Creator Studio has been performed.
- GitHub file existence and route wiring were confirmed after commits, but frontend compile and real Windows end-to-end operation **have not been tested** for these latest changes.

## Next single-pass validation (do not repeat completed tests blindly)

1. Pull this branch once when ready. Restart frontend only to pick up newly compiled React code; restart backend only to load changes in `backend/server.js`.
2. Visit `http://localhost:3001/studio-preview` (or whichever port React displays). This needs no database and lets you see the created page.
3. Validate one small music WAV and one video WebM export on Chrome, noting results.
4. Check `http://localhost:3000/api/health` **once** after the updated backend has restarted. If it reports database unavailable, resolve the specific PostgreSQL error before trying registration again.
5. Authenticated Creator Studio is tested only after registration and page creation work.

Keep passing/failing evidence and code revision tied together. Retest only when related code changes or earlier evidence is inconclusive.

## Architectural boundary

The Creator Studio is a single page; its four tool modules are independently replaceable. Private auth applies to all local-model and agent status backend routes. The preview exposes **no private task, model, or account data**. The Floater's own authority gate remains in control for agent actions. Browser media generation happens client-side.
