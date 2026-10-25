# SKYNZ AI connector prototype

This is a minimal, authenticated, stateless connector to a locally running Ollama server.
It does not mint, deploy code, execute model-suggested commands, or grant model authority.

## Run

1. Install Ollama on the machine hosting the AI runtime (no account needed for local inference).
2. Run `ollama pull qwen2.5:3b` and `ollama serve` (if Ollama is not already running).
3. In the SKYNZ backend environment set `JWT_SECRET` to a strong secret, `AI_PROVIDER=ollama`, `OLLAMA_MODEL=qwen2.5:3b`, and `OLLAMA_BASE_URL=http://127.0.0.1:11434`.
4. Start the backend and log in using its existing auth route.
5. POST `/api/ai/chat` with `Authorization: Bearer <token>`, `Content-Type: application/json`, and `{"message":"Hello Lippy"}`.

**Network:** `127.0.0.1` means the *backend server's* own machine, not a remote creator's laptop. If SKYNZ runs in Railway and Ollama runs on a creator computer, this endpoint cannot connect to that computer. A separate opt-in local companion connector, authenticated outbound tunnel, or an appropriately secured remotely hosted runtime will be required. Never expose Ollama's unauthenticated port publicly.

**Prototype scope:** No persistent assistant memory, coding-task routing, creator-specific system persona, rate limiting, provider failover, or frontend chat UI yet. These are not claimed as complete. Production requires strict per-creator quotas, trusted network configuration, audit logging, and a real authentication secret.

**License:** Check the chosen model license before commercial redistribution or use. The runtime and model have separate terms.
