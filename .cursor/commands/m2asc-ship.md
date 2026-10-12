# /m2asc-ship

Deliver (local commit only) the current plan leaf **only after the human has approved** the review.

## Preconditions

- User explicitly approved (after `/m2asc-review` or equivalent).
- Leaf is `🔍` (or clearly the approved leaf in this chat).
- If approval is unclear, ask — do not ship.

## Do this

1. Ensure implementation matches the approved leaf; apply only trivial fixups if needed.
2. Set the leaf to `✅` in Contents and the leaf body (keep other leaves’ icons untouched).
   - Update the parent step icon only if this ship actually changes it (e.g. first leaf → parent `⏳`, or last leaf → parent `✅`). Otherwise leave the parent line alone.
3. Stage **only** this leaf:
   - `git add` leaf-owned paths from **Files** (plus any other files you changed for this leaf only).
   - Do **not** add unrelated untracked/modified paths.
   - Shared file (`docs/implementation.md`, and any other file with mixed hunks):
     1. After your `✅` edit, snapshot the full working-tree file aside.
     2. Reset that file to `HEAD`.
     3. Re-apply **only** this leaf’s plan edits onto the `HEAD` copy (typically this leaf’s TOC + body `⬜`→`✅`, plus a parent icon change only if step 2 changed it). Intermediate `⏳`/`🔍` for this leaf were never committed — do not invent hunks for other leaves.
     4. `git add` that file.
     5. Restore the aside snapshot over the working tree so other agents’ uncommitted edits remain as local unstaged changes.
4. **Verify before commit:** run `git diff --cached` and confirm every hunk belongs to this leaf. If anything else appears, unstage and fix staging — do not commit.
5. Commit with: `area - subarea, what was done/introduced/fixed`
   - Prefer the message proposed at the end of `/m2asc-next` unless the user gave another.
6. Run `git status`. Report the commit hash and list anything still unstaged/untracked.
7. **Do not push.** Stop here unless the user explicitly asks to push.

Do not ship unrelated dirty files. Do not mark other leaves completed. `/m2asc-ship` never pushes.
