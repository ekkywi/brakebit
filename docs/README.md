# Brakebit docs

Product and planning docs live here. **All files in this folder are public and committed to git** (solo project; may become private later). Setup/run stays in the repo root [`README.md`](../README.md). Agent entrypoints stay at root: [`AGENTS.md`](../AGENTS.md), [`CLAUDE.md`](../CLAUDE.md). Collaboration rules for Cursor live in [`.cursor/rules/collaboration.mdc`](../.cursor/rules/collaboration.mdc).

| Doc | Role |
|---|---|
| [`continue-prompt.md`](./continue-prompt.md) | Copy-paste prompt + current status for a new chat or machine |
| [`STRUCTURE.md`](./STRUCTURE.md) | Folder map after clone |
| [`ROADMAP.md`](./ROADMAP.md) | Product scope + build order |
| [`DESIGN.md`](./DESIGN.md) | Visual / brand direction |
| [`AUTH.md`](./AUTH.md) | Wallet login, credits, crypto top-up plan + status |

Reading order for agents on a fresh machine: `continue-prompt` → `STRUCTURE` → `ROADMAP` → `AUTH` (if touching login/credits) → `DESIGN` (if UI).

When a phase ships, update the status in `continue-prompt.md`, `AUTH.md`, and `ROADMAP.md` together.
