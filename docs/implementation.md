# media-to-ascii implementation (phase 2)

Living plan — **feature-centric**: each top-level Step is one feature; leaves are atomic slices of that feature.  
**Agents: this file is the full brief.** Do not rely on chat history. Read `docs/__workflow.md`, `docs/__spec.md`, **Locked UI (OD)** below, and OD **Media to Ascii** / `media-to-ascii-refresh.html` (D1–D5 in the HTML comment). Older [design-prompt.phase2.md](./design-prompt.phase2.md) is historical if it conflicts with OD. Phase 1 archive: [implementation.phase1.md](./implementation.phase1.md).

## Contents

- [✅ Step 1 — Feature: Convert API cleanup](#step-1--feature-convert-api-cleanup)
  - [✅ 1.1 — FluentValidation + convert form request](#step-11--fluentvalidation--convert-form-request)
  - [✅ 1.2 — Charsets / convert-options GET endpoint](#step-12--charsets--convert-options-get-endpoint)
  - [✅ 1.3 — Typed JSON convert responses](#step-13--typed-json-convert-responses)
  - [✅ 1.4 — AsciiVideo playback timing](#step-14--asciivideo-playback-timing)
- [✅ Step 2 — Feature: Reliable video convert](#step-2--feature-reliable-video-convert)
  - [✅ 2.1 — Temp file utility](#step-21--temp-file-utility)
  - [✅ 2.2 — Extract video frames via temp file](#step-22--extract-video-frames-via-temp-file)
- [✅ Step 3 — Feature: Charsets from API + sample picker](#step-3--feature-charsets-from-api--sample-picker)
  - [✅ 3.1 — Cleanup: do not hard-code ASCII charsets on FE; load from API](#step-31--cleanup-do-not-hard-code-ascii-charsets-on-fe-load-from-api)
  - [✅ 3.2 — FE consume typed JSON convert results](#step-32--fe-consume-typed-json-convert-results)
  - [✅ 3.3 — Charset sample picker UI](#step-33--charset-sample-picker-ui)
- [✅ Step 4 — Feature: Auto-convert UX](#step-4--feature-auto-convert-ux)
  - [✅ 4.1 — Remove Convert button; convert on file/charset/invert](#step-41--remove-convert-button-convert-on-filecharsetinvert)
  - [✅ 4.2 — Width debounce + cancel in-flight convert](#step-42--width-debounce--cancel-in-flight-convert)
- [✅ Step 5 — Feature: Image original | ASCII side-by-side](#step-5--feature-image-original--ascii-side-by-side)
  - [✅ 5.1 — Image ASCII result component](#step-51--image-ascii-result-component)
  - [✅ 5.2 — Original under sidebar; ASCII result](#step-52--original-under-sidebar-ascii-result)
- [✅ Step 6 — Feature: ASCII video player](#step-6--feature-ascii-video-player)
  - [✅ 6.1 — Reusable player: frame display](#step-61--reusable-player-frame-display)
  - [✅ 6.2 — Autoplay in player](#step-62--autoplay-in-player)
  - [✅ 6.3 — Transport controls on player](#step-63--transport-controls-on-player)
  - [✅ 6.4 — Rework video player UI](#step-64--rework-video-player-ui)
  - [✅ 6.5 — Restart resumes playback](#step-65--restart-resumes-playback)
- [✅ Step 7 — Feature: Result views decomposition](#step-7--feature-result-views-decomposition)
  - [✅ 7.1 — Shared ascii-frame-viewer component](#step-71--shared-ascii-frame-viewer-component)
  - [✅ 7.2 — Image ASCII result uses ascii-frame-viewer](#step-72--image-ascii-result-uses-ascii-frame-viewer)
  - [✅ 7.3 — Video player uses ascii-frame-viewer](#step-73--video-player-uses-ascii-frame-viewer)
  - [✅ 7.4 — Convert page result host](#step-74--convert-page-result-host)
- [⬜ Step 8 — Feature: Preview shell (natural ASCII)](#step-8--feature-preview-shell-natural-ascii)
  - [✅ 8.1 — Natural-size ASCII + growable page shell](#step-81--natural-size-ascii--growable-page-shell)
  - [⬜ 8.2 — Shell polish (spacious empty / hug success)](#step-82--shell-polish-spacious-empty--hug-success)
  - [✅ 8.3 — Icon-only Copy (top-right)](#step-83--icon-only-copy-top-right)
  - [✅ 8.4 — Drop page header; empty-state result hint](#step-84--drop-page-header-empty-state-result-hint)
  - [✅ 8.5 — Remove Download; Copy only](#step-85--remove-download-copy-only)
  - [✅ 8.6 — Upload-first empty; preview replaces upload](#step-86--upload-first-empty-preview-replaces-upload)
  - [✅ 8.7 — Sidebar source video preview (display-only)](#step-87--sidebar-source-video-preview-display-only)
  - [✅ 8.8 — Sync source video preview to ASCII player](#step-88--sync-source-video-preview-to-ascii-player)
- [⬜ Step 9 — Finalization](#step-9--finalization)
  - [⬜ 9.1 — UI polish to match Open Design](#step-91--ui-polish-to-match-open-design)
  - [⬜ 9.2 — README adjust for new behavior](#step-92--readme-adjust-for-new-behavior)
  - [⬜ 9.3 — README sample ASCII](#step-93--readme-sample-ascii)
  - [⬜ 9.4 — Refresh __spec.md](#step-94--refresh-__specmd)
  - [⬜ 9.5 — Archive this plan as implementation.phase2.md](#step-95--archive-this-plan-as-implementationphase2md)

### Status legend

| Icon | Meaning |
|------|---------|
| ⬜ | pending |
| ⏳ | in progress |
| 🔍 | under review |
| ⏸️ | postponed — scheduled later; do not claim yet |
| ✅ | completed |

### Agent playbook (read before claiming)

1. Sync Contents + body icons for the leaf you touch.
2. Claim: set leaf to ⏳ **before** editing code.
3. Next **⬜** leaf only if all **Needs** are ✅ and **Files** do not overlap any ⏳/🔍 leaf (respect **Hot files**). **Never claim ⏸️** until a human sets it to ⬜.
4. Implement **only** that leaf; obey **Locked layout** / **Locked contracts** / **Locked UI (OD)**.
5. Done coding → 🔍; propose commit message; **do not** commit unless `/m2asc-ship` or explicit “commit …”.
6. Commit style: `area - subarea, what was done/introduced/fixed`. **Never push.**
7. Follow `.cursor/rules/` (backend/frontend style, no-commit, no-push).
8. On ship of a feature’s **last non-postponed** leaf, set the parent Step ✅ only if every child is ✅ (⏸️ children keep the parent ⏳).

**Hot files** (one agent at a time):  
`{Api}/Program.cs`, `{Api}/Conversion/DependencyInjection.cs`, `{Api}/Common/DependencyInjection.cs`, `{Ng}/src/app/pages/convert/convert-page.ts`, `{Ng}/src/app/app.config.ts`, `{Ng}/src/styles.scss`, `{Ng}/src/app/services/convert-api.service.ts`, this `docs/implementation.md` while claiming/shipping.

### Suggested parallel waves (~3 agents)

Feature steps can advance in parallel when Needs/Files allow.

| Wave | Agent A | Agent B | Agent C |
|------|---------|---------|---------|
| ✅ | **1.x** API cleanup | **2.x** Video temp | **3.x** charsets / JSON / picker |
| ✅ | **4.x** auto-convert | **5.1** image-ascii-result | **6.1 → 6.2 → 6.3** player (component) |
| ✅ | **7.x** viewer + compose + page host | — | — |
| ✅ | **8.6** upload-first empty | — | — |
| ✅ | **6.4** player chrome | — | — |
| ✅ | **8.7** source video preview (display-only) | — | — |
| ✅ | **8.8** sync source video to ASCII player | — | — |
| now | **8.2** shell hug polish | — | — |
| last | **9.x** Finalization (needs **8.3**) | — | — |

Prefer fewer parallel claims over conflicts. **8.x** is sequential.

---

## Context for cold-start agents (today → target)

### What already works

- Angular 19 + ASP.NET Minimal API (.NET 10); ImageSharp; FFMpegCore; system `ffmpeg`/`ffprobe` on PATH.
- `{Api}` = `MediaToAscii/MediaToAscii.Server`, `{Ng}` = `MediaToAscii/mediatoascii.client`.
- **Shipped backend (Steps 1–2):** FluentValidation convert form (charset **id** → `AsciiCharsetType`); `GET /api/config/convert-options`; JSON convert (`AsciiFrame` / `AsciiVideo`); video frames via temp file (exit-69 pipe/seek fixed).
- **Shipped FE:** **3.x** charsets/JSON/picker; **4.x** auto-convert; **5.1** / **7.2** image-ascii-result; **6.x** / **7.3** video player (D2 chrome); **7.1** `ascii-frame-viewer`; **7.4** convert-page result host (result | player; `ascii-preview` removed).
- **Still to build:** shell polish (**8.2**); polish/docs (**9**). **5.2** / **8.7** / **8.8** ✅ source previews (image + video synced to ASCII).
- **UI target (locked):** OD project **Media to Ascii** / `media-to-ascii-refresh.html` (HTML top comment **D1–D5** + 10 frames). Older [design-prompt.phase2.md](./design-prompt.phase2.md) is historical; **OD HTML wins** on any conflict. **No further OD clarification needed** to implement remaining leaves.

### Video runtime note

- FFMpegCore NuGet does not ship binaries — system `ffmpeg`/`ffprobe` required.

### Style

- FE: single-file components; orchestration only on `convert-page.ts`; no ARIA extras. TS aliases: `@services/*`, `@components/*` (see `{Ng}/tsconfig.json`).
- BE: `DependencyInjection.AddConversionServices`; interface+impl one file; `ct`; no `Async` suffix; primary constructors.

---

### Locked layout

```
{Api}/
  Common/                             # shared non-feature utilities
    DependencyInjection.cs
    TempFileUtility.cs                # Step 2.1
  Conversion/
    Constants/
      AsciiCharsets.cs                # AsciiCharsetType + glyph tables + GetGlyphs extension
    ConvertOptions.cs                 # processing params; Charset is AsciiCharsetType
    DependencyInjection.cs
    Entities/
      AsciiFrame.cs                   # Step 1.3
      AsciiVideo.cs                   # Steps 1.3 / 1.4
    Services/
      PixelCharMapper.cs
      ImageAsciiConverter.cs          # returns AsciiFrame
      VideoAsciiConverter.cs          # returns AsciiVideo
  Endpoints/
    ImageConvertEndpoint.cs           # Step 1.3 — returns AsciiFrame JSON
    VideoConvertEndpoint.cs           # Step 1.3 — returns AsciiVideo JSON
    ConfigurationEndpoints.cs         # Step 1.2 — options route + AsciiCharsetOption
    Dtos/                             # request/response types (+ co-located validators)
      ConvertFormRequest.cs           # Step 1.1 (request + ConvertFormRequestValidator)
    Infrastructure/                   # filters, framework glue (not validators)
      ValidationFilter.cs             # Step 1.1
  Program.cs

{Ng}/src/app/
  services/convert-api.service.ts
  services/configuration-api.service.ts  # Step 3.1
  components/                         # shared only
    upload-zone.ts
  pages/convert/
    convert-page.ts                   # Steps 4.x / 7.4 / 5.2 — hosts sidebar + source preview + result; actions in 8.3
    sidebar/
      option-controls.ts              # width debounce (toObservable) + invert + charset picker
      charset-picker.ts               # Step 3.3
      source-image-preview.ts         # Step 5.2 / 8.6 — raw image above options
      source-video-preview.ts         # 8.7 / 8.8 — raw video above options; follows ASCII frame
    results/
      ascii-frame-viewer.ts           # Step 7.1 / 8.3 — AsciiFrame + icon Copy (current frame)
      image-ascii-result.ts           # Steps 5.1 / 7.2 / 5.2 — ASCII-only stage
      ascii-video-player.ts           # Steps 6.x / 7.3 — AsciiVideo + transport; renders ascii-frame-viewer
      (removed) result-actions.ts     # deleted in 8.3 — Copy lives on ascii-frame-viewer
  app.component.ts
  app.config.ts
  styles.scss                         # Step 8.1 growable shell (+ 8.2 / 9.1 polish)
```

### Locked contracts (freeze — do not bikeshed)

| Item | Value |
|------|--------|
| Options route | **`GET /api/config/convert-options`** |
| Options JSON | `[ { "id": "classic", "characters": "..." }, { "id": "detailed", "characters": "..." }, { "id": "blocks", "characters": "..." } ]` |
| Charset ids | `classic`, `detailed`, `blocks` (lowercase) |
| Glyphs | `Conversion/Constants/AsciiCharsets` + `AsciiCharsetType` |
| Image / video routes | `POST /api/convert/image`, `POST /api/convert/video` |
| Form fields | `file`, `width`, `invert`, `charset` (**id**, not glyphs) |
| Image JSON | `{ "ascii": "..." }` (`AsciiFrame`) |
| Video JSON | `{ "frames": [ { "ascii": "..." }, ... ], "durationMs": 5000, "frameDelayMs": 166 }` (`AsciiVideo`) |
| Validation errors | `Results.ValidationProblem(...)` |
| Width | API 20–300 (required on convert form); UI 40–200; FE default 100 |
| Default charset id | FE uses first id from `GET /api/config/convert-options` (API requires charset on convert form) |
| Video | max 30 frames; even sample; system ffmpeg |
| Temp files | Guid path under temp; scoped dispose deletes |
| FE debounce | Width ~400ms; file/charset/invert immediate |
| FE cancel | Cancel prior convert on new request |
| Copy export | **Current frame only** — `frame.ascii` of the visible `ascii-frame-viewer` (image or video’s current index). No multi-frame join. |
| Copy UI | **Copy only** on `ascii-frame-viewer`: icon-only **`bi-copy`** (NOT `bi-clipboard`), top-right of the frame stage; `title="Copy"` OK; disabled when ascii empty |
| Charset UI | Segmented strip (shared outer border); selected = inset accent + subtle fill; monospace glyphs; no name labels |
| Player | input `AsciiVideo`; owns index/timing via `frameDelayMs`; emits `frameChange` (sidebar source video follows via `index * frameDelayMs`); Play/Pause toggle + **2×** (`bi-fast-forward-fill`) + Restart + flex seek on one row under ASCII; all transport buttons icon-only; **2×** active = half `frameDelayMs`; no loop (stop on last frame; Play from end → frame 0); **Restart** → frame 0 and play (start if paused/ended, keep going if already playing); autoplay on new `video` (resets 2× off); renders via `ascii-frame-viewer` |
| ascii-frame-viewer | input `AsciiFrame`; monospace `<pre>` at **natural size** (no CSS scale); parents must not clip/scroll it |
| Result host | convert-page: loading \| error \| `image-ascii-result` (image) \| `ascii-video-player` (video); no success via `ascii-preview` |
| Preview / shell | **Step 8**: natural-size ASCII; centered page shell grows with ASCII up to viewport (L/R padding → 0); spacious empty |
| Design | OD `media-to-ascii-refresh.html` (project **Media to Ascii**); D1–D5 in HTML comment; frames 1–10 |

**Mapper note:** HTTP parses charset **id → `AsciiCharsetType` once** (validator/form boundary); `ConvertOptions.Charset` is the enum; mapper uses `charset.GetGlyphs()`.

### Locked UI (OD) — implement 1:1 (no further design debate)

Source: OD **Media to Ascii** / `media-to-ascii-refresh.html` (decision comment + frames). Critique notes must match HTML; HTML wins.

| ID | Decision |
|----|----------|
| **D1** | Source preview **above** options (sidebar column width, height from aspect ratio): **image** = still; **video** = muted display-only `<video>` (no controls; `pointer-events: none`) scrubbed to ASCII player frame (`index * frameDelayMs`) — ASCII player is source of truth. Result region is ASCII only. |
| **D2** | Video transport: Play/Pause **toggle** + **2×** (`bi-fast-forward-fill`, two triangles) + Restart + flex seek on **one row under ASCII**; **icons only**; **2×** active = pressed look; stop on last frame (**no loop**); Play from end restarts at 0; no frame counter. OD frames **6** (playing), **7** (ended), **10** (mobile) — speed control is a product add-on beyond OD. |
| **D3** | **Copy only** (no Download), on the **visible frame** (`ascii-frame-viewer`). Icon-only **`bi-copy`** (NOT `bi-clipboard`); **top-right** of the frame stage; disabled when empty. Transport stays under ASCII; Copy is not in the transport row. |
| **D4** | Shell: empty/loading/error **spacious** (~360px min); success **hugs** natural-size ASCII (**no** CSS scale; **no** ASCII-pane scrollbars). Centered working area has a default laptop width (~1080); when ASCII needs more width, the shell **grows horizontally** (equal L/R padding shrinks) up to the viewport (padding → ~0). Controls left \| preview right. |
| **D5** | Charset: **segmented strip** (shared outer border); selected = inset accent bar + subtle fill; left-aligned monospace glyphs; ellipsis if long. |

**OD frame map (gallery):** 1 Empty · 2 Loading · 3 Image typical · 4 Image wide ASCII · 5 Image narrow ASCII · 6 Video playing · 7 Video ended · 8 Error · 9 Mobile image · 10 Mobile video.

**Angular map:** upload · options (width/invert/charset) · result-host · `ascii-frame-viewer` (incl. Copy) · `image-ascii-result` · `ascii-video-player` · `source-image-preview` · `source-video-preview`. Brand via document `<title>` only (**8.4** — no on-page tool-header).

---

## Goal

Feature-complete phase 2: reliable video; API-owned charsets + picker; JSON convert; auto-convert; shared `ascii-frame-viewer`; image side-by-side + video player composed from it; convert-page result host; OD-matched fit/shell/actions; docs/spec; archive plan.

## Agreed decisions

- Plan is **feature-centric** (Step = feature).
- No Convert button; auto-convert.
- Charset UI: clickable samples only (no name labels, no native radios) — look = **D5**.
- Image layout (**D1**): original under sidebar; ASCII in result region. Video = ASCII player only (no raw video pane).
- Never commit unless asked / `/m2asc-ship`; never push.
- **UI locked:** OD `media-to-ascii-refresh.html` + **Locked UI (OD)** above. Do **not** block on further OD work unless product intent changes. No open design clarification questions remain.
- **Result decomposition (Step 7):** ✅ one shared `ascii-frame-viewer`; `image-ascii-result` + player compose it; convert-page hosts loading | error | image result | player.
- **Rename:** `image-compare` → `image-ascii-result` (file / selector / class).
- **FE folders:** shared UI in `components/` (`upload-zone`); convert page UI under `pages/convert/` with `sidebar/` + `results/` (incl. `ascii-frame-viewer`) + `convert-page.ts`.
- **Functional first:** **7.x** done before **8.x**. Scale-to-fit approach **rejected** — ASCII stays natural size; shell grows instead.
- **Atomic work:** **5.2** ✅. Reminder polish stays in **8.2** / **8.3** / **6.4**.
- **Shell / preview / actions (Step 8):** match **D3–D4** (growable shell + natural ASCII). Do **not** interpret “fluid” as always full-bleed empty preview; do **not** CSS-scale ASCII.
- **Natural size:** **8.1** keeps ASCII at glyph size and grows `.page-shell` with content; image-ascii-result/player must not introduce pane scrollbars.

## Living plan

Keep Contents + body icons in sync. Prefer plan ✅ updates on ship only.

---

## Step 1 — Feature: Convert API cleanup

Shared API contract work other features depend on.

### Step 1.1 — FluentValidation + convert form request

- Status: ✅
- Needs: —
- Files: `{Api}/Endpoints/Dtos/**`, `{Api}/Endpoints/ImageConvertEndpoint.cs`, `{Api}/Endpoints/VideoConvertEndpoint.cs`, delete `Helpers/ConvertFormValidation.cs` when unused
- Do: FluentValidation package + filter infra already landed; remaining: `ConvertFormRequest` `[FromForm]` + co-located validator under Dtos; `AddAutoValidation`; form charset id → `AsciiCharsetType` on `ConvertOptions`; keep **text/plain** success until 1.3
- Done when: TryParse helper gone; invalid → ValidationProblem; valid convert still works
- Commit: `backend - api, FluentValidation for convert form`

### Step 1.2 — Charsets / convert-options GET endpoint

- Status: ✅
- Needs: —
- Files: `{Api}/Endpoints/ConfigurationEndpoints.cs`, `{Api}/Program.cs`, `{Api}/Endpoints/Infrastructure/DependencyInjection.cs` (AddEndpointJson)
- Do: `GET /api/config/convert-options` via `ConfigurationEndpoints` (response records co-located); locked JSON from `AsciiCharsetType` + `GetGlyphs()`; global camelCase enum JSON
- Done when: GET returns classic/detailed/blocks with correct glyphs
- Commit: `backend - api, add convert options charsets endpoint`

### Step 1.3 — Typed JSON convert responses

- Status: ✅
- Needs: 1.1
- Files: `{Api}/Conversion/Entities/**`, `{Api}/Conversion/Services/ImageAsciiConverter.cs`, `{Api}/Conversion/Services/VideoAsciiConverter.cs`, `{Api}/Endpoints/ImageConvertEndpoint.cs`, `{Api}/Endpoints/VideoConvertEndpoint.cs`
- Do: return domain `AsciiFrame` / `AsciiVideo` as JSON (no separate endpoint response DTOs; no server-side `----` join)
- Done when: both routes return locked JSON
- Commit: `backend - api, return typed JSON convert results`

### Step 1.4 — AsciiVideo playback timing

- Status: ✅
- Needs: 1.3
- Files: `{Api}/Conversion/Entities/AsciiVideo.cs`, `{Api}/Conversion/Services/VideoAsciiConverter.cs`, `{Ng}/src/app/services/convert-api.service.ts` (`AsciiVideo` type only)
- Do: extend `AsciiVideo` with `DurationMs` + `FrameDelayMs` from probed duration and even sample spacing (`durationMs / frameCount`, min 1 when duration > 0; else 0); mirror fields on FE `AsciiVideo`; update Locked contracts; no player wiring here
- Done when: video convert JSON includes `durationMs` and `frameDelayMs` with frames; FE type matches
- Commit: `backend - api, add AsciiVideo duration and frame delay`

---

## Step 2 — Feature: Reliable video convert

Fix exit-69 pipe/seek failure.

### Step 2.1 — Temp file utility

- Status: ✅
- Needs: —
- Files: `{Api}/Common/TempFileUtility.cs`, `{Api}/Common/DependencyInjection.cs`, `{Api}/Program.cs` (AddCommonServices only)
- Do: `ITempFileUtility` + scoped impl under Common (not Conversion); Persist stream with Guid path; dispose deletes
- Done when: DI resolves utility; builds
- Commit: `backend - io, add scoped temp file utility`

### Step 2.2 — Extract video frames via temp file

- Status: ✅
- Needs: 2.1
- Files: `{Api}/Conversion/Services/VideoAsciiConverter.cs`, `{Api}/Conversion/DependencyInjection.cs` (scoped registration)
- Do: persist upload; probe/extract from file path; `-map 0:v:0`; no pipe+seek; max 30 frames; parallel ASCII; no temp leaks
- Done when: phone MP4 converts with system ffmpeg
- Commit: `backend - video, extract frames from temp file`

---

## Step 3 — Feature: Charsets from API + sample picker

Stop hard-coding glyphs on FE; picker shows API samples.

### Step 3.1 — Cleanup: do not hard-code ASCII charsets on FE; load from API

- Status: ✅
- Needs: 1.2
- Files: `{Ng}/src/app/services/configuration-api.service.ts`, delete `constants/ascii-charsets.ts`, update callers (`option-controls`, `default-convert-options`)
- Do: load charsets via `ConfigurationApiService`; send charset **id** (not glyphs); delete hard-coded FE glyph tables
- Done when: no hard-coded charset glyphs in FE; options from API
- Commit: `frontend - cleanup, load charsets from API not hard-coded`

### Step 3.2 — FE consume typed JSON convert results

- Status: ✅
- Needs: 1.3
- Files: `{Ng}/src/app/services/convert-api.service.ts`, minimal page typing
- Do: JSON `AsciiFrame` / `AsciiVideo` (`ascii` / `frames[].ascii` + `durationMs` / `frameDelayMs`); not `responseType: 'text'`; page still compiles
- Done when: client parses JSON convert responses
- Commit: `frontend - api, consume JSON convert responses`

### Step 3.3 — Charset sample picker UI

- Status: ✅
- Needs: 3.1
- Files: `{Ng}/src/app/pages/convert/sidebar/charset-picker.ts`, `option-controls.ts`
- Do: match OD — three clickable monospace samples from API `{ id, characters }`; emit id; no name labels (Classic/…); no native radios; no “Character set” heading required; width/invert stay on option-controls
- Done when: click sample selects charset id; looks like OD options charset grid
- Commit: `frontend - ui, add charset sample picker`
- Note: locked visual is **D5** (segmented strip). Any drift vs OD → fix in **9.1** (or small follow-up), not a new leaf.

---

## Step 4 — Feature: Auto-convert UX

Owns `convert-page.ts` for convert triggers (done before result-host wiring in **7.4**).

### Step 4.1 — Remove Convert button; convert on file/charset/invert

- Status: ✅
- Needs: 3.2, 3.3
- Files: `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**)
- Do: remove Convert button; convert immediately on file / charset / invert; leave width debounce to 4.2
- Done when: no Convert button; those inputs retrigger convert
- Commit: `frontend - wire, auto-convert on file and options`

### Step 4.2 — Width debounce + cancel in-flight convert

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/pages/convert/sidebar/option-controls.ts`, `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**)
- Do: ~400ms width debounce in option-controls via `toObservable` + `debounceTime` (charset/invert emit immediately with live width); cancel prior HTTP on new convert
- Done when: rapid width changes don’t stack; latest wins on convert
- Commit: `frontend - wire, debounce width and cancel in-flight convert`

---

## Step 5 — Feature: Image original | ASCII side-by-side

**5.1** / **7.2** shipped. **5.2** locks **D1**: original under sidebar; ASCII owns the result region (human chose after screenshot compare).

### Step 5.1 — Image ASCII result component

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/pages/convert/results/image-ascii-result.ts` (was `image-compare.ts`)
- Do: match OD image success — original image URL + ASCII side by side; stack on narrow; not used for video. Use a simple scrollable `<pre>` for ASCII for now (fit deferred **Step 8**). Component-only — do not touch `convert-page` here.
- Done when: component demos side-by-side with inputs
- Commit: `frontend - ui, add image ASCII result component`

### Step 5.2 — Original under sidebar; ASCII result

- Status: ✅
- Needs: 8.1
- Files: `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**), `{Ng}/src/app/pages/convert/sidebar/source-image-preview.ts` (**new**), `{Ng}/src/app/pages/convert/results/image-ascii-result.ts`
- Do: **atomic only** — original image **below** the sidebar card via `source-image-preview` (not inside the card); small gap between card and preview; width = sidebar column width; height proportional (keep aspect ratio). Result column = ASCII only (`image-ascii-result` → `ascii-frame-viewer`). No hug/shell polish, no icon-action move (those are **8.2** / **8.3**). Video: no source preview.

- Done when: image convert shows source under controls + ASCII alone on the right; Copy/Download stay as before
- Commit: `frontend - ui, original under sidebar ASCII result`

---

## Step 6 — Feature: ASCII video player

**6.x** / **7.3** shipped — player chrome matches **D2**.

### Step 6.1 — Reusable player: frame display

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`
- Do: input `video` (`AsciiVideo`); player owns `currentFrameIndex` (start at 0); show current frame in a simple scrollable `<pre>`; **no** transport controls yet. Fit/hug comes later in **Step 8**.
- Done when: mock `AsciiVideo` shows frame 0
- Commit: `frontend - ui, add ASCII video player frame display`

### Step 6.2 — Autoplay in player

- Status: ✅
- Needs: 6.1
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`
- Do: on new `video` input, reset to frame 0 and set `playing`; while `playing`, advance `currentFrameIndex` on `video.frameDelayMs`; stop at last frame (no loop); **no** transport UI yet; **no** page mount
- Done when: mock `AsciiVideo` advances frames automatically in isolation
- Commit: `frontend - ui, autoplay ASCII video player`

### Step 6.3 — Transport controls on player

- Status: ✅
- Needs: 6.2
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`
- Do: Play/Pause, Restart, seek bar under ASCII; drive existing `playing` / frame index; no speed; **no** page mount
- Done when: controls work in component isolation
- Commit: `frontend - ui, add ASCII video player transport controls`

### Step 6.4 — Rework video player UI

- Status: ✅
- Needs: 8.2
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts` (and styles only if required)
- Do: match **D2** / OD frames **6**, **7**, **10** — single Play/Pause **toggle** + Restart + seek on **one horizontal row** under ASCII; **icons only** (no Play/Pause/Restart text); keep no-loop + Play-from-end → 0; no frame counter; no speed. Human un-postponed and claimed without waiting for **8.2** (parallel UI OK; Files stay player-only).
- Done when: transport chrome matches OD D2 (desktop + mobile)
- Commit: `frontend - ui, rework ASCII video player controls`

### Step 6.5 — Restart resumes playback

- Status: ✅
- Needs: 6.3
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`
- Do: Restart must seek to frame 0 **and** ensure playback — start if paused/ended; keep playing if already playing. Today Restart only resets the index, so a stopped/paused video stays still at the start.
- Done when: Restart from playing, paused mid-video, or ended all show frame 0 advancing (or already advancing)
- Commit: `frontend - player, restart seeks to start and plays`

---

## Step 7 — Feature: Result views decomposition

Shared frame → compose consumers in parallel → one page host leaf.

### Step 7.1 — Shared ascii-frame-viewer component

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/pages/convert/results/ascii-frame-viewer.ts` (**new**)
- Do: single-file component; input required `frame` (`AsciiFrame`); render monospace `<pre>` of `frame.ascii`; glyph presentation only (font/whitespace/color) — **no** intrinsic min/max size (parent owns layout/scroll); **no** loading/error/hint; **no** transport; **no** image pane. Fit deferred to **8.1**.
- Done when: component renders a mock `AsciiFrame` in isolation
- Commit: `frontend - ui, add shared ascii-frame-viewer component`

### Step 7.2 — Image ASCII result uses ascii-frame-viewer

- Status: ✅
- Needs: 7.1, 5.1
- Files: `{Ng}/src/app/pages/convert/results/image-ascii-result.ts` only (was `image-compare.ts`)
- Do: replace inner ASCII `<pre>` with `<app-ascii-frame-viewer [frame]="frame()" />`; inputs `imageUrl` + `frame` (`AsciiFrame`); keep original image pane + responsive grid sizing/scroll; do not touch player (page call-site may bind `frame`)
- Done when: still side-by-side; ASCII comes only from `ascii-frame-viewer`
- Commit: `frontend - ui, compose image ASCII result with ascii-frame-viewer`

### Step 7.3 — Video player uses ascii-frame-viewer

- Status: ✅
- Needs: 7.1, 6.3
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts` only
- Do: replace frame-pane `<pre>` with `<app-ascii-frame-viewer [frame]="…" />` (current `AsciiFrame` from `video.frames`); keep transport/autoplay + pane sizing/scroll; do not touch `image-ascii-result` or `convert-page`
- Done when: player still plays; ASCII comes only from `ascii-frame-viewer`
- Commit: `frontend - ui, compose video player with ascii-frame-viewer`

### Step 7.4 — Convert page result host

- Status: ✅
- Needs: 7.2, 7.3, 4.2
- Files: `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**); delete `{Ng}/src/app/components/ascii-preview.ts` if unused
- Do: stop using `ascii-preview` for success. Page shows **loading** | **error** | empty hint | **`image-ascii-result`** (image success: object URL + `AsciiFrame`; revoke URL on file change / destroy) | **`ascii-video-player`** (video success: bind `AsciiVideo`). Keep Copy/Download flatten for video (`\n\n----\n\n`). Loading/error/empty can live inline on the page (or a tiny host) — not a second ASCII renderer.
- Done when: image → `image-ascii-result`; video → player; loading/error work; `ascii-preview` gone or unused
- Commit: `frontend - wire, convert page result host for image result and player`

---

## Step 8 — Feature: Preview shell (natural ASCII)

Gated by **Needs: 7.4** (✅). Scale-to-fit was tried and rolled back — **do not** CSS-scale ASCII.

ASCII at natural glyph size; no ASCII-pane scrollbars. Centered page working area grows with wide ASCII until L/R padding ≈ 0. Actions match **D3**.

**Split:** **8.1** = natural-size ASCII + growable centered shell (**D4** core). **8.2** = spacious empty / hug polish. **8.3** = icon-only Copy top-right (**D3**). **8.4** = drop on-page tool-header. **8.5** = remove Download (Copy only). **8.6** = upload-first empty; image preview above controls. **8.7** = display-only sidebar source **video** preview (no sync). **8.8** = scrub that preview to follow the ASCII player (player = source of truth).

### Step 8.1 — Natural-size ASCII + growable page shell

- Status: ✅
- Needs: 7.4
- Files: `{Ng}/src/styles.scss`, `{Ng}/src/app/pages/convert/results/ascii-frame-viewer.ts`, `{Ng}/src/app/pages/convert/results/image-ascii-result.ts`, `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`, optionally `{Ng}/src/app/pages/convert/convert-page.ts`
- Do: keep ASCII at natural `<pre>` size (**no** `transform` scale). Remove ASCII-pane `overflow: auto` / max-height clamps that force scrollbars. Centered `.page-shell` defaults to ~1080px working width on laptop; when the result (sidebar + ASCII) needs more horizontal room, shell/`tool-layout` grow with content up to the viewport so equal L/R padding shrinks toward zero (paint mockup: gray controls | green ASCII as one expanding centered unit).
- Done when: narrow ASCII keeps side padding; wide ASCII expands the working area without scaling or ASCII scrollbars
- Commit: `frontend - layout, natural-size ASCII with growable page shell`

### Step 8.2 — Shell polish (spacious empty / hug success)

- Status: ⬜
- Needs: 8.1, 5.2
- Files: `{Ng}/src/styles.scss`, `{Ng}/src/app/pages/convert/convert-page.ts`, optionally `pages/convert/results/*`
- Do: match remaining **D4** — spacious empty/loading/error (~360px min feel); on success **hug** ASCII (no large empty field beside narrow art — drop forced ~24rem result min on success); keep equal L/R padding from **8.1**. **Reminder (from 5.2 scope cut):** do not ship this inside 5.2.
- Done when: empty feels like a real workspace; narrow success hugs; layout balanced
- Commit: `frontend - layout, shell spacious empty and hug polish`

### Step 8.3 — Icon-only Copy (top-right)

- Status: ✅
- Needs: 8.5
- Files: `{Ng}/src/app/pages/convert/results/ascii-frame-viewer.ts`, `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**); delete `{Ng}/src/app/pages/convert/results/result-actions.ts` if unused
- Do: match **D3** — move Copy onto **`ascii-frame-viewer`**: icon-only **`bi-copy`** (NOT `bi-clipboard`), `title="Copy"`, **top-right** of the frame stage. Copy **`frame.ascii` only** (current visible frame — for video that is the player’s current index). Remove page-level `result-actions` / multi-frame join export. No Copy on empty/loading/error (no viewer). Not in the transport row. **8.2** not required for this leaf.
- Done when: image + video Copy copies only the on-screen frame; no Download; no page-level Copy under the result
- Commit: `frontend - ui, icon-only copy current frame on viewer`

### Step 8.4 — Drop page header; empty-state result hint

- Status: ✅
- Needs: 8.1
- Files: `{Ng}/src/app/app.component.ts`, `{Ng}/src/styles.scss`, `{Ng}/src/app/pages/convert/convert-page.ts`
- Do: remove on-page `.tool-header` (h1 + subtitle) so the working area starts at the tool layout — reclaim vertical space for ASCII. Keep brand in the document `<title>` only. **Do not** add sidebar-footer instructions. On empty (no result yet), show one short hint in the result pane (upload zone already covers drop/choose). Tighten shell top spacing that existed mainly for the header.
- Done when: no title band above the tool; empty result has a brief hint; success/loading/error unchanged aside from gained viewport height
- Commit: `frontend - ui, drop page header and keep empty-state result hint`

### Step 8.5 — Remove Download; Copy only

- Status: ✅
- Needs: 7.4
- Files: `{Ng}/src/app/pages/convert/results/result-actions.ts`; update Locked contracts / **D3** in this plan
- Do: remove Download / file-export from the UI and component (`download()` + button). Keep a single Copy action (labeled as today; icon/placement + current-frame copy land in **8.3**).
- Done when: no Download control or blob-download path; Copy still works; contracts say Copy-only
- Commit: `frontend - ui, remove download keep copy only`

### Step 8.6 — Upload-first empty; preview replaces upload

- Status: ✅
- Needs: 8.4
- Files: `{Ng}/src/app/pages/convert/convert-page.ts`, `{Ng}/src/app/components/upload-zone.ts`, `{Ng}/src/app/pages/convert/sidebar/source-image-preview.ts`
- Do: **Empty:** only a centered upload zone (no width/invert/charset, no result pane). **After file chosen:** show tool layout (options + result). **Image:** display-only source preview above controls (flush/no padding; not clickable; no replace). **Video:** no sidebar preview in this leaf (→ **8.7** / **8.8**). Options once a file is selected. Result column for loading | error | success. Supersedes sparse empty + **8.4** hint. Upload zone has no variant API — welcome only.
- Done when: first paint is centered upload only; image success shows preview + options; video shows options + player only; no change-file controls
- Commit: `frontend - ui, upload-first empty and preview replaces upload`

### Step 8.7 — Sidebar source video preview (display-only)

- Status: ✅
- Needs: 8.6
- Files: `{Ng}/src/app/pages/convert/sidebar/source-video-preview.ts` (**new**), `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**); update **D1** / Locked layout in this plan
- Do: **phase 1 of video source preview** — when a video file is chosen, show muted display-only raw video above options (same slot as image). Full sidebar width; height from aspect ratio. No controls; `pointer-events: none`; no replace-file. Object URL create/revoke with the file. **Do not** sync to ASCII player (that is **8.8**). ASCII player unchanged.
- Done when: video upload shows static-looking source strip + options + ASCII player; preview cannot be played/scrubbed by the user
- Commit: `frontend - ui, add display-only source video preview`

### Step 8.8 — Sync source video preview to ASCII player

- Status: ✅
- Needs: 8.7
- Files: `{Ng}/src/app/pages/convert/results/ascii-video-player.ts`, `{Ng}/src/app/pages/convert/sidebar/source-video-preview.ts`, `{Ng}/src/app/pages/convert/convert-page.ts` (**hot**); update **D1** / Player contract
- Do: **phase 2** — ASCII player remains source of truth. Emit current frame index (`frameChange`); convert-page maps `index * frameDelayMs` → preview `currentTime` (ms). Preview stays paused, no controls; seek `video.currentTime` to match. Reset on new file.
- Done when: play / 2× / restart / seek on ASCII player advances the sidebar source frame accordingly; user still cannot manipulate the preview
- Commit: `frontend - player, sync source video preview to ASCII frame`

---

## Step 9 — Finalization

### Step 9.1 — UI polish to match Open Design

- Status: ⬜
- Needs: 7.4, 4.2, 8.3
- Files: `{Ng}/src/app/pages/**`, `components/**`, `styles.scss`
- Do: final pass vs OD `media-to-ascii-refresh.html` + **Locked UI (OD)** (D1–D5); verify charset **D5**, transport **D2**, actions **D3**, shell **D4**, image-ascii-result **D1**; no new features
- Done when: UI shippable vs locked OD mockup
- Commit: `frontend - ui, polish to phase2 Open Design`

### Step 9.2 — README adjust for new behavior

- Status: ⬜
- Needs: 4.1
- Files: `README.md`
- Do: auto-convert, FFmpeg, player — concise
- Done when: README accurate
- Commit: `docs - readme, update for phase2 UX`

### Step 9.3 — README sample ASCII

- Status: ⬜
- Needs: 9.2
- Files: `README.md`
- Do: short sample at bottom
- Done when: sample on GitHub
- Commit: `docs - readme, add sample ASCII output`

### Step 9.4 — Refresh __spec.md

- Status: ⬜
- Needs: 4.1, 1.3
- Files: `docs/__spec.md`
- Do: phase 2 capabilities/contracts; correct plan links
- Done when: spec matches product
- Commit: `docs - spec, refresh for phase2`

### Step 9.5 — Archive this plan as implementation.phase2.md

- Status: ⬜
- Needs: all other phase-2 leaves ✅ **or** ⏸️ (no ⬜/⏳/🔍 left)
- Files: `docs/implementation.md` → `docs/implementation.phase2.md`
- Do: rename per `__workflow.md`; postponed leaves may remain ⏸️ or be finished first (human choice)
- Done when: archive exists; active plan file gone
- Commit: `docs - plan, archive phase2 implementation`

---

## Out of scope

- Color ASCII, PNG export, media-from-URL
- Auth, DB, Docker, bundling ffmpeg
- Non-trivial automated tests
- Push to remote (human-only)
- Editing phase-1 archives except broken-link fixes
- Further Open Design passes unless product intent changes (UI is locked)
