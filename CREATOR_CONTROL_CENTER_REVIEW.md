# Creator Control Center — review candidate

Branch: `build/creator-control-center-v1`. This is **not merged or deployed**.

## Implemented in this branch
- Side-by-side creator page editor and live preview
- Editable title, handle, description, support link
- Two Spotify / YouTube player slots with constrained embed hosts
- Editable real social links and four accent colors
- Authenticated page-by-ID lookup, ownership-checked update, save/create
- Additive schema migration for new creator page fields
- Page-view analytics insert corrected to include creator_id
- Placeholder mint endpoint disabled (501); no blockchain dependency
- Public page no longer exposes creator_id in its API response

## Prerequisites / review sequence
1. **Back up the existing PostgreSQL database.**
2. Set `backend/.env` with a real DATABASE_URL and a random JWT_SECRET at least 32 characters. Do not commit this file.
3. Run `backend/creator_page_upgrade.sql` once against the backed-up database.
4. From `backend`: `npm install` then `npm start`.
5. From `frontend`: `npm install` then `npm start`. Configure `frontend/.env` with `REACT_APP_API_URL=http://localhost:3000`.
6. Register/login, create a page, edit it, save it, refresh, open its public URL, verify both media slots and social URLs, verify analytics records a page view.
7. Check invalid handles, duplicate handles, expired tokens, cross-account edits, and duplicate/invalid media URLs.
8. Review browser console, network errors, and database logs. Only then consider merging.

## Known limitations
- **Not yet build-tested or end-to-end-tested.** These commits are source changes, not a verified production deployment.
- This is a form-based page builder, not drag-and-drop canvas editing.
- OBS, multistream broadcasting, green screen, Lippy, creator apps, live analytics dashboard, and Solana minting are not implemented here.
- Existing chat is a basic Socket.IO feature; it needs rate limits, moderation, and abuse protection before public launch.
- Existing backend CORS and authentication need a separate production security review.
- The repository's `backend/database.sql` contains a base schema; the additive migration is required for existing databases.
- No deployment or merge should occur without owner review and successful local tests.
