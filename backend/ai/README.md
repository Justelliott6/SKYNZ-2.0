# SKYNZ Creator Page AI agent

The authenticated page-draft endpoint uses the Ollama provider configured by the backend. It returns a constrained draft suggestion; the Creator Control Center requires the creator to review and apply it before saving.

## Local setup

1. Install Ollama and download the configured model, for example qwen2.5:3b.
2. Start Ollama on the same computer as the backend, or set OLLAMA_BASE_URL to a trusted private Ollama service the backend can reach.
3. Copy backend/.env.example to backend/.env. Set DATABASE_URL and a unique JWT_SECRET with at least 32 characters. Set AI_PROVIDER, OLLAMA_MODEL, and OLLAMA_BASE_URL.
4. Run the existing creator page schema migration, backend/creator_page_upgrade.sql, if it has not already been applied.
5. Start the backend and frontend, then sign in and use the Creator Control Center page builder.

The model does not receive database access or page-write tools. The endpoint validates the response and only returns allowed page fields. It does not save or publish.

127.0.0.1 refers to the backend computer. If SKYNZ is hosted remotely while Ollama runs on the creator's computer, the hosted backend cannot reach that loopback address. Do not expose Ollama's unauthenticated port publicly.

This is a prototype integration. Per-creator quotas, rate limiting, audit logging, remote runtime design, build verification, and end-to-end validation remain outstanding.
