# Favicon prompt (Open Design)

Prompt for generating the **media-to-ascii** favicon (implementation step **9.2**). Forward the block below into Open Design.

```text
Create a favicon set for the web app "media-to-ascii".

Product
- Turns uploaded images and videos into ASCII art (monospace text).
- Tool-like, not playful marketing: simple, strict, conservative, minimal.

Visual language (match the existing UI prototype)
- Muted neutral palette only:
  - background / light: #f4f4f5
  - surface / white: #ffffff
  - foreground: #2f3033
  - muted: #6c6f76
  - border: #d8d9dc
  - accent (quiet primary): #4a4d55
- No purple, no neon glow, no gradients, no 3D, no skeuomorphism, no emoji.
- Prefer flat geometric mark; optional tiny monospace character motif.

Concept (pick one clear idea; keep it readable at 16×16)
- Preferred: a small square or rounded-square glyph that reads as “media → text”, e.g. a tiny frame/grid dissolving into a few ASCII characters such as @ # * . or ▓ ▒ ░ (blocks charset), OR a single bold monospace "@" / "#" on a quiet field.
- Must still look intentional when tiny in a browser tab.
- Avoid literal camera/filmstrip clichés if they become noisy at small size.

Deliverables
1. Primary mark preview (HTML page showing the icon large + at 32px and 16px).
2. Export-ready assets:
   - favicon.ico (multi-size if practical: 16, 32, 48)
   - favicon-32.png and favicon-16.png (or SVG favicon if crisp and simple)
3. Brief note on suggested <link rel="icon"> paths for an Angular app under /public/.

Constraints
- One mark only; no wordmark/logo lockup needed in the favicon itself.
- High contrast enough on both light browser chrome and dark tab strips (test light bg; if needed provide a single neutral dark-safe variant using #2f3033 field + light glyphs).
- Keep file simple so it can be dropped into mediatoascii.client/public/favicon.ico.
```
