# SKYNZ PC Bridge (prototype)

Standalone, **local-first Windows companion** for SKYNZ 2.0. Its Node.js process uses only built-in modules (no npm install).

Download the prepackaged Windows ZIP from the related ChatGPT artifact to get the launcher, UI, and instructions.

## Local usage
Extract the ZIP, double-click `START-SKYNZ-BRIDGE.cmd`, visit `http://127.0.0.1:37641`, and click **CHECK SKYNZ NOW**. The bridge checks frontend port 3001, backend port 3000, PostgreSQL port 5432, Git status, and the health endpoint's database readiness.

## Optional ChatGPT relay
Create a **private** GitHub issue repository, connect it in the local panel with a repository-scoped GitHub Issues read/write fine-grained token. The token is memory-only. The bridge accepts strict `SKYNZ_BRIDGE_TASK_V1` work orders created by the configured owner after connection; read-only checks can run automatically, and any source reading, git pull, or program launch needs explicit click-to-approve locally. It posts results to the same private GitHub issue.

Actions: `ping`, `diagnose`, `git_status`, `read_file`, `git_pull`, `start_backend`, `start_frontend`.

**Does not provide unrestricted remote command execution or automatic editing.** The local UI binds only `127.0.0.1`. It is a proof of concept, not a security-audited remote management product. See bundled README.txt for full details.
