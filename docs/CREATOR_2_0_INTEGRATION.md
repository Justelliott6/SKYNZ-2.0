# SKYNZ 2.0 Creator integration

Status: **implementation branch; not deployed or accepted**.

This branch preserves main and existing prototype branches. The new authenticated backend/creatorRoutes.js module provides an owner-scoped page lookup by UUID and a draft creation route that retains embed and affiliate fields.

Integration steps for a reviewed merge:
1. Import creatorRoutes in backend/server.js and mount `app.use('/api/creator-pages', creatorRoutes(pool, verifyToken));` after verifyToken is defined.
2. Point the Creator Page editor's UUID lookup at `/api/creator-pages/:id`, leaving the public handle route unchanged.
3. Use `POST /api/creator-pages/draft` for draft creation. The schema must match the columns in backend/database.sql.
4. Configure backend and frontend on distinct ports and set matching API and Socket.IO URLs.
5. Fix analytics creator_id population, platform destinations, and authentication secret enforcement before production.
6. Keep minting disabled until payment, confirmation, ownership records and Solana integration are implemented.

No claim of runtime verification, deployment, security certification, or minting. Existing Floater and local Ollama installations are untouched.
