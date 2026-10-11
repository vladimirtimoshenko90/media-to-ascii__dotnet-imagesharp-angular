# /m2asc-review

Review pending changes for the current plan leaf (status `🔍` or the leaf just implemented in this chat).

## Do this

1. Identify the current leaf from `docs/implementation.md` and this chat.
2. Diff the working tree (and staged files if any) related to that leaf.
3. Check for:
   - conflicts with other `⏳` / `🔍` leaves (same files or overlapping behavior)
   - duplication vs the rest of the codebase
   - drift from `docs/spec.md` and the leaf stop criterion
   - thin endpoints / no browser-side image processing
   - obvious bugs, missing validation, or messy structure
4. Report a clear verdict: **approve**, **approve with nits**, or **request changes** (with concrete fixes).
5. Do **not** commit, push, or mark the leaf `✅`. Leave status at `🔍` unless you must fix blocking issues the user asks you to apply.

If nothing is pending, say so.
