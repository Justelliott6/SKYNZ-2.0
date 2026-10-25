# SKYNZ 2.0 — prototype test checklist

This branch is a development prototype, **not a verified production deployment**.

## Prerequisites
- Node.js and npm
- Running PostgreSQL
- A local `skynz` database

## Backend
1. From `backend/`, run `npm install`.
2. Set `DATABASE_URL`, `JWT_SECRET` (32+ random characters), `PORT=3001`, and `FRONTEND_URL=http://localhost:3000` in a local `.env` file. Never commit real secrets.
3. For a fresh database, apply `backend/database.sql`. For an existing database, apply `backend/migrations/001_platform_urls.sql`.
4. Run `npm run dev`. Check `http://localhost:3001/api/health`.

## Frontend
1. From `frontend/`, run `npm install`.
2. Set `REACT_APP_API_URL=http://localhost:3001` and `REACT_APP_SOCKET_URL=http://localhost:3001` in a local `.env` file.
3. Run `npm start` and visit `http://localhost:3000`.

## Manual acceptance checks
1. Register and log in as a test creator.
2. Create a page with a unique handle and a real platform URL.
3. Reload dashboard; confirm page persists.
4. Edit page title, description, and platform URL; save and reload.
5. Open public creator page; confirm changes and actual platform link.
6. Visit public page; confirm page-view total increases in dashboard.
7. Open the public page in two browser tabs; send a chat message and confirm delivery; close/reopen a tab and check for duplicate events.
8. Verify another account cannot edit a page it does not own.
9. Verify badge minting returns HTTP 501 rather than pretending to mint.

## Known prototype limits
- On-chain ownership anchoring, publish gating, marketplace, payments, and controlled ad playback are not yet implemented in this branch.
- Chat has basic input checks, but needs abuse controls before public testing.
- JWT currently persists in browser localStorage; authentication needs hardening before production.
- A build, automated integration tests, and end-to-end runtime verification are still required.
