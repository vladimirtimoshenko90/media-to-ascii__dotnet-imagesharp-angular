# /m2asc-next

Claim the next non-conflicting leaf from `docs/implementation.md` and implement it.

## Do this

1. Open `docs/implementation.md` (Agent playbook, Needs, Files, Hot files, Locked layout).
2. List leaves marked `⏳` or `🔍` and collect their **Files**.
3. Choose the next `⬜` leaf that:
   - has all **Needs** leaves `✅`,
   - does **not** overlap **Files** (or **Hot files**) with any `⏳`/`🔍` leaf.
4. Set that leaf to `⏳` in both Contents and the leaf body.
5. Implement **only** that leaf on **Locked layout** paths. Follow `docs/spec.md` and project rules.
6. When coding is finished:
   - set the leaf to `🔍`
   - summarize what changed
   - propose one commit message in the project format: `area - subarea, what was done/introduced/fixed`
7. Stop. Do **not** commit, push, or start another leaf.

If no safe leaf exists (all remaining conflict with in-flight work), say so and wait.
