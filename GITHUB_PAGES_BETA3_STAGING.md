# SKYNZ Beta 3 — GitHub Pages staging

**Status: staged, not deployed.** This branch prepares an isolated static-preview destination. It does **not** contain the current Windows-installed Beta 3 frontend yet.

## Scope
- GitHub Pages can serve the browser UI and test responsive display.
- It cannot host the local SKYNZ Node/Express backend, PostgreSQL, Ollama, or AI Floater.
- Therefore, an unconnected GitHub Pages copy **cannot** verify whether Lippy generates a design blueprint. That requires a separately hosted, properly secured API or the existing local installation.

## Safe deployment procedure
1. Using authorized local Windows file access, identify the **actual installed Beta 3** frontend output, not the older source on `main`.
2. Inspect the built JavaScript and HTML for hardcoded local URLs, secrets, creator data, and auth assumptions. **Do not upload database dumps, private files, environment variables, model caches, account information, or credentials.**
3. Copy only approved public static files to `docs/` **on this branch**. If the build requires server APIs, replace unsupported interactions with an explicit unavailable/offline state rather than making false success claims.
4. Ensure paths work under `/SKYNZ-2.0/`. Confirm `docs/index.html` and all CSS/JS/assets load using the GitHub Pages path.
5. Only after a reviewed static export exists, enable GitHub Pages in repository **Settings → Pages → Deploy from a branch → preview/beta3-github-pages → /docs → Save**.
6. Verify the published URL, use at least desktop and mobile visual checks, and label the build **UI preview only / Lippy backend offline** unless a secure integration is explicitly implemented and tested.

## Preservation
Do not modify the installed Windows Beta 3 release, Ollama/models, creator database, backups, GitHub `main`, live SKYNZ site, or publishing/approval controls. No automatic minting, creator sign-ins, or payments.

## Visual direction (later, not part of the deployment)
Mostly black and charcoal surfaces; soft green for highlights only. Fix functional Page Design routing before visual polish.
