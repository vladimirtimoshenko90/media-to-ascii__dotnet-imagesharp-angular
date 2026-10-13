Design a UI refresh for the existing single-page web tool **media-to-ascii** (on-screen title: Media to ASCII). Supporting line: Convert images and video to ASCII art.

This replaces the phase-1 interaction model. Keep the same quiet utilitarian look. One HTML/CSS (or HTML/JSX) artifact, desktop-first + one narrow layout. **Deliver at most 6 labeled frames** (list below). Do not invent more states, themes, or pages.

---

PRODUCT
- Server converts media to ASCII; UI only uploads, sets options, shows results.
- One page. No auth, history, settings, routing, or secondary screens.
- No Convert button — changing file or options updates the result automatically.
- Copy and Download (.txt) when result text exists.

VISUAL DIRECTION
- Simple, strict, conservative, utilitarian. Light near-neutral palette (soft off-white/gray bg, dark gray text). Soft borders, muted secondary text.
- Avoid: bold brand colors, gradients, glow, heavy shadows, neon, purple/indigo, cream+terracotta “AI” looks, dark mode, glass, neumorphism, decorative illustration.
- Color only for function (focus, disabled, error). At most one quiet neutral accent — or none.
- Plain professional sans (Bootstrap-friendly). Monospace only for ASCII (`line-height: 1`). No display fonts.
- Almost no motion except functional loading and ASCII frame playback.
- Sparse Bootstrap Icons + text labels on actions. Nearly-default Bootstrap; borders only to clarify regions. No decorative cards.

LAYOUT / SHELL (fixes vs phase 1)
- Desktop: controls left, preview right (or equivalent simple split). Mobile: stack.
- **No scrollbars** in the ASCII preview (vertical or horizontal). Phase 1 allowed horizontal scroll for wide ASCII — **do not**; fit instead.
- ASCII is **plaintext** (selectable text), not canvas/SVG-as-image. Uniform CSS scale / fit-to-pane is OK so the whole block stays visible.
- Shell must stay **visually balanced**: do not leave a large empty left margin while content overflows the right edge of the viewport. Working area may grow toward full width; keep similar left/right page padding.
- Wide/tall ASCII must shrink to fit the preview pane — never force page-level overflow.

CONTROLS
1. Header — product name + supporting line. Text only; no nav/logo mark required.
2. Upload — drag-and-drop + choose file; image/* and video/*; show selected file name (empty / drag-over / selected).
3. Width — slider 40–200, default 100, show current value.
4. Invert — checkbox, default off, label “Invert”.
5. Charset picker — **not** a `<select>`, **not** native radio dots, **no names** like Classic/Detailed/Blocks.
   - Show **three** clickable monospace samples (all visible), e.g. roughly:
     - `@%#*+=-:. ` 
     - a longer dense mix (detailed)
     - `█▓▒░ ` 
   - Click selects one; selected state via border/background only.
6. No primary Convert button anywhere.

PREVIEW
- States: empty hint, loading, error (one plain sentence), success.
- **Image success:** original image **and** ASCII **side by side** (stack on mobile). ASCII pane fits with no scrollbars. Realistic placeholder ASCII (not lorem).
- **Video success:** ASCII-only “player” (frames of plaintext swapping). **Autoplay** when ready. Do **not** show the raw video beside it.
- Player controls **under** the ASCII preview: Play/Pause, Restart, horizontal seek bar (proportion jumps in the sequence). No speed control. No HTML `<video>` required.
- Copy + Download near the result (below preview / below player controls). Secondary to the preview itself.

COPY (exact or equivalent plain wording)
- Upload empty: Drop an image or video here, or choose a file.
- Preview empty: ASCII output will appear here.
- Error: Conversion failed. Check the file and try again.
- Buttons: Copy, Download, Play, Pause, Restart
- Tone: plain, professional, short. No jokes, hype, or emoji.

REGIONS (map to UI pieces)
Header, upload, options (width/invert/charset samples), preview (image pair or video player), player controls (video only), result actions. No sidebars, tabs, wizards, galleries, drawers, theme toggles.

FRAMES TO DELIVER (exactly these 6 — no more)
1. Empty / initial (defaults, empty preview, charset samples visible, no Convert button)
2. Loading (file selected, preview loading)
3. Image success — original | ASCII side by side, fit, no scrollbars; Copy/Download on
4. Video success — ASCII playing + Play/Pause, Restart, seek bar; Copy/Download on
5. Error
6. Narrow / mobile — image success stacked

Also: tiny muted token note (background, text, muted, border, focus, error). Easy to rebuild with Angular + Bootstrap utilities; minimal custom CSS.

NON-GOALS
Color ASCII, PNG export, URL input, auth, sharing, onboarding, marketing landing, Convert button, charset dropdown/labels, canvas ASCII, speed control, source-video preview, extra frames/variants, ornamental systems.

PRIORITY
No-scrollbar fit + balanced shell > auto-convert (no Convert) > charset samples > image side-by-side > video player controls > polish.
