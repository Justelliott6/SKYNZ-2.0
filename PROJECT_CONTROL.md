# PROJECT_CONTROL — durable project memory and decision ledger

Last updated: 2026-10-28 (America/Chicago).
Repository: Justelliott6/SKYNZ-2.0. Ledger location: repository root.
Purpose: preserve project state, decisions, evidence, uncertainties, and the next action across sessions.

## Evidence rules

- **Code verified** means observed in the inspected repository source; it does not mean runtime tested.
- **Session reported** means recorded in the referenced conversation or explicitly supplied by the owner; it was not independently reproduced during this documentation task.
- **Intended** means architecture/product direction, not a delivered feature.
- **Pending** means acceptance evidence is still needed.
- Preserve earlier work and branch boundaries. Record dates, exact refs, test conditions, outcomes, and unresolved questions. Never promote a README claim, model suggestion, or DONE label alone into proof.
- Never record secret values, tokens, private keys, credentials, private customer data, or unredacted sensitive logs.

## Inspection baseline and branch map

Inspected 2026-10-28 using the connected GitHub repository:
- main: 6f8639a762958d22d196b41a1ee8d146479f181a, "Fix local MVP creator flow and database setup."
- SKYNZ-MVP-17: a3997fb44b9c65ed659c9242f1d577704ebc47b4. Tree includes modular creator-page components, theme configuration, and AIDesigner. Runtime behavior not verified here.
- feature/ollama-connector-prototype: 08acca42b28c6b390f0d09f70d736aa8a8d58a3a. Separate AI connector prototype; do not assume merged into main.
- feature/personal-creator-apps: b7ca3b58987fff2d5c5535206ee3511925a6b1b9. Branch existence verified; implementation not reviewed in this pass.
- prototype-repairs: e566afe572cbc7b7aca9e3b692fa54f9444c602e. PROTOTYPE_TESTING.md explicitly calls this a development prototype, with build, integration, and end-to-end verification pending.
- feature/waitlist-signup points to the same inspected commit as main; its name alone is not evidence of signup implementation.

No PROJECT_CONTROL.md was present in the inspected main tree. No application code, existing docs, branches, or backups were changed in this task.

## Verified source implementation on main — runtime unverified

Sources: README.md, SKYNZ_2.0_README.md, backend/server.js, backend/database.sql, backend/package.json, frontend/package.json, frontend/src/App.jsx, frontend/src/store/authStore.js, and page components.

| Area | Observed implementation | Limits / evidence still needed |
| --- | --- | --- |
| Stack | Express/Node, PostgreSQL schema, Socket.IO; React 18, Router, Zustand, Tailwind, Chart.js | Install, build, database initialization, and runtime checks not run in this pass |
| Accounts | Registration/login, bcrypt hashing, JWT issuance/verification; frontend token stored in localStorage | Production hardening and session/authorization tests pending |
| Profiles/pages | Profile GET/PUT; page create/list/public read/update/delete; ownership condition on page update/delete | Full creator flow and cross-account checks pending |
| Public creator page | Media iframe, platform labels, support link, chat UI, page-view request | Platform links in inspected public component use placeholder href; not proof of platform API integrations |
| Chat | Page room join, database message insert, broadcast, join/leave notifications | No demonstrated moderation, rate limiting, chat history replay, or abuse resistance |
| Analytics | Page-view insert route, creator-filtered read route, dashboard/chart UI, schema indexes | Insert omits schema-required creator_id: expected failure on supplied schema, not reproduced here; watch-time and demographic collection not established |
| Badges | List and mint-named route writing a placeholder database mint address | Actual Solana minting is a TODO; no verified NFT or on-chain ownership |
| Health | /api/health returns status/timestamp | Does not establish database health or end-to-end readiness |

## Intended architecture and product direction

The existing READMEs describe creator-owned command pages, multiple platforms, monetization, blockchain ownership/badges, streaming, and analytics. These describe direction beyond verified delivery. Their old roadmap dates and "Production Ready" labels are not acceptance evidence.

Not established as implemented on main: real minting/ownership anchoring, publish gating, marketplace/payment processing/revenue distribution, Restream/platform API orchestration, controlled ad playback, advanced analytics, and drag-and-drop design.

AI prototype evidence: feature/ollama-connector-prototype/backend/ai/README.md describes authenticated, stateless local Ollama chat; backend/ai/ollama.js calls /api/chat with a configured model and timeout. This does not establish successful live integration. README scope statements may lag other files on that branch (its tree also includes LippyChat.jsx); inspect code and test before making UI claims.

Network decision: 127.0.0.1 refers to the machine running the caller/backend. A hosted backend cannot use that address to reach an owner's different computer. Remote deployment needs a separately designed, authenticated connection. Keep Ollama's unauthenticated listener private.

Owner visual concepts in docs/OWNER_SPECIAL_FEATURES.md on the AI branch are explicitly design-only: manually repositioned Lippy lips, future speech synchronization, and a separate optional rabbit visual. No implicit AI authority or creator permissions.

## 2026-10-28 Floater / Ollama session checkpoint

Evidence: owner instruction and available recent turns of "All SKYNZ codeng and setup" (conversation 6ae0e0e0-6960-83ea-9670-a6a4e8446151). The available history is bounded; it is not a full transcript.

- **Session reported:** CPU-only Ollama server successfully listening at 127.0.0.1:11434; prior conversation described inference compute and library as cpu.
- **Session reported:** Floater was running.
- **Pending:** Floater integration with this CPU-only Ollama server has not yet been retested. No successful Floater → Ollama → SKYNZ end-to-end result is established.
- **Session reported:** Standalone CPU Ollama had worked previously, but an error appeared when connecting it into Floater/SKYNZ. These are separate test boundaries.
- **Hypothesis only:** An existing Windows auto-start Ollama process may have blocked a new CPU-only server and contributed to CUDA failures. This does not prove the cause of the integration error.
- **Not applied:** security patch 01. Its exact artifact, contents, target, and acceptance tests were not available in the retrieved history; do not infer that unrelated prototype repairs applied it.
- **No Floater code changed today**, per session report and owner instruction. This ledger task changes no Floater code.
- Runtime state above describes the session checkpoint, not a claim that those processes remain running now.

## Backups and recovery

- Preserve the existing backups referenced by the owner. Their exact names, locations, timestamps, coverage, and restore validity were not exposed in the available conversation or inspected main tree. Inventory and verify them before any repair; do not overwrite or delete them.
- Verified Git recovery references: main baseline 6f8639a762958d22d196b41a1ee8d146479f181a and initial commit c25ca53458803d5f2c25adf8408e663d142a9f09; preserve the development branch heads listed above.
- Git history is not proof of a database, local Floater workspace, model, environment, or uncommitted-file backup. No backup was created or restore-tested by this documentation task.
- Pending inventory fields: artifact name/location (safe identifier only), creation time, source ref, included/excluded data, checksum if available, and latest restore-test result.

## Open issues and pending validation

1. Floater integration failure remains unexplained; capture exact redacted error, model, caller location, endpoint, process state, and timing on the next test.
2. Security patch 01 remains unapplied; locate and review its exact scope before a separate application task.
3. main analytics insert/schema mismatch requires runtime confirmation and a separately scoped fix.
4. PageBuilder loads /api/pages/:pageId, while the inspected GET route resolves a handle; editing by UUID needs verification. Create route does not persist the submitted embed/support fields; verify create/edit behavior separately.
5. main contains permissive HTTP CORS, an insecure fallback JWT configuration, unauthenticated chat, and no observed rate limiter. README security checkmarks do not prove hardening or production HTTPS.
6. backend migrate script references migrations/run.js, absent from inspected main tree. database.sql supplies tables but does not create the database despite setup instructions invoking it against postgres. Confirm setup procedure.
7. Frontend/backend defaults both use port 3000; configure distinct ports and matching API/socket origins for local acceptance tests.
8. prototype-repairs/PROTOTYPE_TESTING.md is a checklist, not a passed test report. Its changes must not be assumed present on main.
9. Inventory existing backups; verify restoration before risky repairs.

## Decision ledger

| Date | Decision | Status / reason |
| --- | --- | --- |
| 2026-10-28 | Use this root ledger for durable project memory | Owner requested; document-only change |
| 2026-10-28 | Separate standalone Ollama health from Floater integration success | CPU-only startup does not prove the integration works |
| 2026-10-28 | Preserve source and branch work; commit only this ledger | No application repair or patch application authorized as part of the ledger task |
| 2026-10-28 | Maintain a research record for a possible future white paper | Owner requested recording findings useful to others; no novelty or generality claim without evidence |
| 2026-10-28 | Build a subscription-free local Windows screen recorder with microphone audio, designed for possible future SKYNZ app integration | New owner request; intended, not implemented. Computer-audio capture not yet specified. Keep recording consent, local file control, and a future integration boundary explicit |

## Research / future white-paper record

Keep dated entries for both successes and failures. Record: question, hypothesis, hardware/software versions, branch/commit, safe configuration, reproduction steps, expected versus actual behavior, sanitized evidence, interpretation, limitations, and next experiment. Record who observed a result and whether it was independently reproduced. Preserve raw evidence privately when sensitive; publish only reviewed/redacted extracts.

Initial observation (2026-10-28): session reported CPU-only Ollama startup at loopback port 11434 after GPU/process troubleshooting; Floater integration remains untested against that confirmed server. Potentially useful investigation, but not yet a proven general remedy or novel discovery. Missing evidence: exact runtime/model versions, hardware details, launch configuration, full sanitized logs, and repeated integration results.

Future white-paper candidates: CPU/GPU process-selection troubleshooting; distinguishing model-server health from application integration; local-first creator tools; subscription-free screen capture as a future SKYNZ app. These are research topics, not established conclusions. Do not claim a complete historical archive: older conversations and backup records still need reconciliation.

## Next action / resume point

**Floater next:** confirm the CPU-only Ollama listener is active, then rerun the same small Floater task against it. Accept success only with DONE plus an actual expected answer and corresponding request evidence. Record exact sanitized failure if it fails. Then test the SKYNZ connection separately. Do not rebuild or declare success based solely on standalone Ollama startup.

**Recorder next:** implement a separate local Windows screen-and-microphone recording prototype without changing existing SKYNZ application code in this ledger task; preserve a clean future SKYNZ integration boundary. Verify recording, microphone sound, stop/save, and playback before claiming completion.

After each experiment: append outcome/evidence here, update open issues and next action, and identify any resulting code commit separately from this documentation commit.
