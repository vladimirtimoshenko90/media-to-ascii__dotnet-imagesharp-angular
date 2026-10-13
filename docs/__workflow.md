# Docs & agent workflow

Standing guide for how this repo’s `docs/` and Cursor plan flow work. Not a feature plan — process only.

## What lives in `docs/`

| Kind | Naming | Role |
|------|--------|------|
| Process | `__workflow.md` (this file) | How docs/plans are created and transitioned |
| Product spec | `__spec.md` | High-level product/design north star |
| Active plan | `implementation.md` | Current living implementation plan (agents work here) |
| Archived plans | `implementation.phaseN.md` | Finished phases (history; do not delete) |
| Design briefs | `design-prompt.phaseN.md` | Open Design UI briefs (per phase) |
| Design assets | `favicon-prompt.md` (etc.) | One-off assets; not phase-scoped |

Do **not** delete historical docs. Add new files; archive completed plans by rename.

## Active plan rule

- Agents and `/m2asc-*` commands always use **`docs/implementation.md`**.
- When a phase is fully done: rename `implementation.md` → `implementation.phaseN.md` (finalization leaf), then start the next phase as a **new** `implementation.md`.
- Design work: add `design-prompt.phaseN.md` (or similar); never overwrite older design-prompt archives.

## Plan status icons

| Icon | Meaning |
|------|---------|
| `⬜` | pending |
| `⏳` | in progress (claimed) |
| `🔍` | under review |
| `✅` | completed (approved + committed locally) |

Keep Contents TOC and leaf body icons in sync. Status on disk is the multi-agent lock.

## Agent commands

- `/m2asc-next` — claim next safe leaf; implement; set `🔍`; propose commit message; **do not** commit
- `/m2asc-review` — review pending leaf; **do not** commit
- `/m2asc-ship` — after human approval: `✅`, stage that leaf only, **local** commit; **never** push

Follow each plan’s Agent playbook, Needs, Files, Hot files, Locked layout/contracts.

## Git

- **Commit** only on `/m2asc-ship` or an explicit “commit …” request (see `.cursor/rules/m2asc-no-commit.mdc`).
- **Never push** — even if asked (see `.cursor/rules/m2asc-no-push.mdc`).

## Starting a new phase (checklist)

1. Archive previous active plan if still named `implementation.md` → `implementation.phaseN.md`.
2. Write new `docs/implementation.md` (Contents, legend, playbook, leaves, all `⬜`).
3. If UI redesign: add `docs/design-prompt.phaseN.md` (bounded; don’t explode OD scope).
4. Leave `__workflow.md` / `__spec.md` and older archives untouched unless correcting process itself.
