Design a complete UI for media-to-ascii: a small single-page web tool that converts uploaded images and videos into ASCII art.

PRODUCT
- Name (page title): media-to-ascii
- Supporting line: Convert images and video to ASCII art.
- Flow: pick image or video → set options → Convert → see monospace ASCII → Copy or Download as .txt
- Conversion runs on a server; the UI only uploads media + options and displays plain text. Do not invent client-side editing, filters, or processing UIs.
- One page only. No auth, accounts, history, settings, routing, or secondary screens.

VISUAL DIRECTION
- Simple, strict, conservative, utilitarian. As little styling as possible while staying clear.
- Quiet tool page — not marketing, not a dashboard, not a design-system showcase.
- Light theme. Near-neutral palette (soft off-white / light gray background, dark gray text). Soft borders and muted secondary text. Readable, but low visual drama.
- Avoid: bold brand colors, gradients, glow, heavy shadows, neon, purple/indigo themes, cream+terracotta “AI default” looks, dark mode, glassmorphism, neumorphism, decorative illustration.
- Use color only for function (focus, disabled, error). At most one quiet neutral accent — or none.
- UI type: plain professional sans (default Bootstrap stack is fine). Monospace only in the ASCII preview (tight line-height: 1). No display fonts.
- Almost no motion; only a functional loading indication if needed.
- Sparse Bootstrap Icons only where helpful (upload, copy, download). Text labels required on actions.
- Prefer nearly-default Bootstrap + careful spacing over custom chrome. Borders/backgrounds only to clarify interactive regions (dropzone, preview). No decorative cards.

PAGE STRUCTURE (single surface)
Top → bottom; on desktop a simple two-column layout (controls left / preview right) is acceptable if it stays simpler than forcing everything into one tall column. Mobile stacks cleanly; wide ASCII may scroll horizontally.

1. Header — product name + one supporting line. Text only; no nav, no logo mark required.
2. Upload zone — drag-and-drop + choose-file. Accepts image/* and video/*. Show selected file name. States: empty, drag-over, selected.
3. Options —
   - Width: slider 40–200, default 100, show current value
   - Invert: checkbox, default off (label: Invert)
   - Character set: select with Classic / Detailed / Blocks, default Classic
4. Convert — one primary button in the page shell (not inside every sub-region). Disabled with no file and while loading.
5. ASCII preview — monospace pre-like block, line-height 1. States: empty hint, loading, error (plain sentence), success (ASCII text). Video success is still plain text: multiple ASCII blocks separated by a simple dash separator (e.g. ----); scrollable text, not a video player or frame carousel.
6. Result actions — Copy and Download (.txt). Enabled only when result text exists. Visually secondary to Convert.

Exact UI copy to use (or equivalent plain wording):
- Upload empty: Drop an image or video here, or choose a file.
- Preview empty: ASCII output will appear here.
- Preview error example: Conversion failed. Check the file and try again.
- Buttons: Convert, Copy, Download
Tone: plain, professional, short. No jokes, hype, or emoji.

REGIONS TO KEEP DISTINCT
Design clear visual regions that can map to separate UI pieces: shell (header + Convert), upload zone, option controls, ASCII preview, result actions. Do not add sidebars, tabs, wizards, galleries, drawers, or theme toggles.

STATES TO SHOW
Labeled frames or sections for:
1. Empty / initial (no file, defaults, empty preview)
2. File selected (Convert enabled)
3. Loading
4. Success — image (realistic placeholder ASCII, not lorem ipsum; Copy/Download on)
5. Success — video (multi-block ASCII with a simple separator; optional separate frame)
6. Error
7. Narrow / mobile stack of the same page

NON-GOALS
Do not design: color ASCII, PNG export, URL input, auth, sharing, onboarding, marketing landing above the tool, extra pages, or ornamental visual systems.

DELIVERABLE
One clean HTML/CSS (or HTML/JSX) artifact of this tool UI, desktop-first plus responsive stack, with the states above. Include a tiny muted-neutral token note (background, text, muted text, border, focus, error). Structure should be easy to reimplement with Angular + Bootstrap utilities — minimal custom CSS, no design-system inventiveness.

Priority if tradeoffs arise: clear convert workflow > distinct regions > polish.
