# SKYNZ 3.3 ASUS desktop test build

This is an **unsigned Windows Electron test installer**, built automatically by GitHub Actions and downloadable from the successful workflow run's Artifacts section.

**Current limitation:** the installer bundles the React creator interface only. The API server, PostgreSQL, Ollama/Floater and designer runtime are NOT bundled or started by this installer. Login, saving and AI drafting require a separately running backend. External API integrations and Solana minting are not required to test the desktop shell. Do not distribute this as a production-ready offline package.

The app intentionally does not expose local filesystem access to page content. Installer signing and full backend/service packaging remain release blockers.
