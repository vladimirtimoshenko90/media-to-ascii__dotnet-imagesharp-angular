# /m2asc-ship

Deliver (commit + push) the current plan leaf **only after the human has approved** the review.

## Preconditions

- User explicitly approved (after `/m2asc-review` or equivalent).
- Leaf is `🔍` (or clearly the approved leaf in this chat).
- If approval is unclear, ask — do not ship.

## Do this

1. Ensure implementation matches the approved leaf; apply only trivial fixups if needed.
2. Set the leaf to `✅` in Contents and the leaf body.
3. Stage the leaf’s code changes **and** `docs/implementation.md`.
4. Commit with the agreed message format: `area - subarea, what was done/introduced/fixed`
   - Prefer the message proposed at the end of `/m2asc-next` unless the user gave another.
5. Push to the tracked remote branch.
6. Confirm with `git status` and report the commit hash / push result.

Do not ship unrelated dirty files. Do not mark other leaves completed.
