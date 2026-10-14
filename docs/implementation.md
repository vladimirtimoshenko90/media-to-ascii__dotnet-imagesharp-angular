# media-to-ascii implementation (phase 2)

Living plan — **feature-centric**: each top-level Step is one feature; leaves are atomic slices of that feature.  
**Agents: this file is the full brief.** Do not rely on chat history. Read `docs/__workflow.md`, `docs/__spec.md`, [design-prompt.phase2.md](./design-prompt.phase2.md), and OD **Media to Ascii** / `media-to-ascii-refresh.html`. Phase 1 archive: [implementation.phase1.md](./implementation.phase1.md).

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
- [⏳ Step 5 — Feature: Image original | ASCII side-by-side](#step-5--feature-image-original--ascii-side-by-side)
  - [✅ 5.1 — Image compare component](#step-51--image-compare-component)
  - [⏸️ 5.2 — Rework image compare UI](#step-52--rework-image-compare-ui)
- [⏳ Step 6 — Feature: ASCII video player](#step-6--feature-ascii-video-player)
  - [✅ 6.1 — Reusable player: frame display](#step-61--reusable-player-frame-display)
  - [✅ 6.2 — Autoplay in player](#step-62--autoplay-in-player)
  - [✅ 6.3 — Transport controls on player](#step-63--transport-controls-on-player)
  - [⏸️ 6.4 — Rework video player UI](#step-64--rework-video-player-ui)
- [⏳ Step 7 — Feature: Result views decomposition](#step-7--feature-result-views-decomposition)
  - [✅ 7.1 — Shared ascii-frame-viewer component](#step-71--shared-ascii-frame-viewer-component)
  - [✅ 7.2 — Image compare uses ascii-frame-viewer](#step-72--image-compare-uses-ascii-frame-viewer)
  - [✅ 7.3 — Video player uses ascii-frame-viewer](#step-73--video-player-uses-ascii-frame-viewer)
  - [⬜ 7.4 — Convert page result host](#step-74--convert-page-result-host)
- [⬜ Step 8 — Feature: Preview fit + page shell](#step-8--feature-preview-fit--page-shell)
  - [⬜ 8.1 — ASCII frame-viewer fit (no scrollbars)](#step-81--ascii-frame-viewer-fit-no-scrollbars)
  - [⬜ 8.2 — Shell + preview sizing per Open Design](#step-82--shell--preview-sizing-per-open-design)
  - [⬜ 8.3 — Compact Copy / Download actions](#step-83--compact-copy--download-actions)
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
4. Implement **only** that leaf; obey **Locked layout** / **Locked contracts**.
5. Done coding → 🔍; propose commit message; **do not** commit unless `/m2asc-ship` or explicit “commit …”.
6. Commit style: `area - subarea, what was done/introduced/fixed`. **Never push.**
7. Follow `.cursor/rules/` (backend/frontend style, no-commit, no-push).
8. On ship of a feature’s **last non-postponed** leaf, set the parent Step ✅ only if every child is ✅ (⏸️ children keep the parent ⏳).

**Hot files** (one agent at a time):  
`{Api}/Program.cs`, `{Api}/Conversion/DependencyInjection.cs`, `{Api}/Common/DependencyInjection.cs`, `{Ng}/src/app/pages/convert-page.ts`, `{Ng}/src/app/app.config.ts`, `{Ng}/src/styles.scss`, `{Ng}/src/app/services/convert-api.service.ts`, this `docs/implementation.md` while claiming/shipping.

### Suggested parallel waves (~3 agents)

Feature steps can advance in parallel when Needs/Files allow.

| Wave | Agent A | Agent B | Agent C |
|------|---------|---------|---------|
| ✅ | **1.x** API cleanup | **2.x** Video temp | **3.x** charsets / JSON / picker |
| ✅ | **4.x** auto-convert | **5.1** compare | **6.1 → 6.2 → 6.3** player (component) |
| ✅ | **7.1** `ascii-frame-viewer` | — | — |
| now | **7.2** compare→viewer | **7.3** player→viewer | — |
| then | **7.4** page result host (`convert-page`) | — | — |
| UI | **8.1 → 8.2 → 8.3** fit + shell + compact actions (after **7.4**) | — | — |
| later | **5.2** / **6.4** UI rework (⏸️ → un-postpone after host/shell as noted on each leaf) | — | — |
| last | **9.x** Finalization (needs **8.3**; may run while **5.2**/**6.4** still ⏸️) | — | — |

**7.2** and **7.3** are the parallel pair (different Files). **7.4** is solo (hot page). Prefer fewer parallel claims over conflicts.

---

## Context for cold-start agents (today → target)

### What already works

- Angular 19 + ASP.NET Minimal API (.NET 10); ImageSharp; FFMpegCore; system `ffmpeg`/`ffprobe` on PATH.
- `{Api}` = `MediaToAscii/MediaToAscii.Server`, `{Ng}` = `MediaToAscii/mediatoascii.client`.
- **Shipped backend (Steps 1–2):** FluentValidation convert form (charset **id** → `AsciiCharsetType`); `GET /api/config/convert-options`; JSON convert (`AsciiFrame` / `AsciiVideo`); video frames via temp file (exit-69 pipe/seek fixed).
- **Shipped FE:** **3.x** charsets/JSON/picker; **4.x** auto-convert; **5.1** / **7.2** image-compare (`ascii-frame-viewer`); **6.1/6.2/6.3** / **7.3** video player (`ascii-frame-viewer`); **7.1** `ascii-frame-viewer`. Page still uses kitchen-sink `ascii-preview` for all results.
- **Still to build:** **7.4** page result host; then fit/shell (**8**, incl. compact actions **8.3**); polish/docs (**9**). Postponed UI: **5.2**, **6.4**.
- **UI target (later):** OD `media-to-ascii-refresh.html`. Brief: [design-prompt.phase2.md](./design-prompt.phase2.md).

### Video runtime note

- FFMpegCore NuGet does not ship binaries — system `ffmpeg`/`ffprobe` required.

### Style

- FE: flat single-file components; orchestration only on `convert-page.ts`; no ARIA extras.
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
  utils/
    debounced-signal.ts               # Step 4.2
  components/
    upload-zone.ts
    option-controls.ts                # width + invert + charset picker (bound from page)
    charset-picker.ts                 # Step 3.3
    ascii-frame-viewer.ts             # Step 7.1 — AsciiFrame input; fit in 8.1
    image-compare.ts                  # Steps 5.1 / 7.2 — original + ascii-frame-viewer
    ascii-video-player.ts             # Steps 6.x / 7.3 — AsciiVideo + transport; renders ascii-frame-viewer
    result-actions.ts                 # Copy / Download; compact in 8.3
    ascii-preview.ts                  # retire on 7.4 (was loading|error|text kitchen sink)
  pages/convert-page.ts               # Steps 4.x / 7.4 — result host
  app.component.ts
  app.config.ts
  styles.scss                         # Step 8.2 (+ polish 9.1) when UI pass runs
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
| Copy/Download | Join video frame `.ascii` strings with `\n\n----\n\n` |
| Player | input `AsciiVideo`; owns index/timing via `frameDelayMs` (FE fallback ~120ms if 0); Play/Pause, Restart, seek; no speed; autoplay on new `video`; renders via `ascii-frame-viewer` |
| ascii-frame-viewer | input `AsciiFrame`; monospace `<pre>` only (no intrinsic size); parent sizes/scrolls until **8.1** fit |
| Result host | convert-page: loading \| error \| `image-compare` (image) \| `ascii-video-player` (video); no success via `ascii-preview` |
| Preview / fit | **Step 8** (after **7.4**): fit on `ascii-frame-viewer`; OD spacious empty / hug success |
| Design | [design-prompt.phase2.md](./design-prompt.phase2.md); OD artifact `media-to-ascii-refresh.html` (project **Media to Ascii**) |

**Mapper note:** HTTP parses charset **id → `AsciiCharsetType` once** (validator/form boundary); `ConvertOptions.Charset` is the enum; mapper uses `charset.GetGlyphs()`.

---

## Goal

Feature-complete phase 2: reliable video; API-owned charsets + picker; JSON convert; auto-convert; shared `ascii-frame-viewer`; image side-by-side + video player composed from it; convert-page result host; then deferred fit preview/shell; docs/spec; archive plan.

## Agreed decisions

- Plan is **feature-centric** (Step = feature).
- No Convert button; auto-convert.
- Charset UI: clickable samples only (no name labels, no native radios).
- Image side-by-side; video = ASCII player only (no raw video pane).
- Never commit unless asked / `/m2asc-ship`; never push.
- **UI mockups locked:** Open Design **Media to Ascii** / `media-to-ascii-refresh.html` is enough — do not block on further OD frames unless product intent changes.
- **Result decomposition (Step 7):** one shared `ascii-frame-viewer` for a single `AsciiFrame`; `image-compare` and `ascii-video-player` compose it; convert-page shows loading | error | compare | player.
- **Functional first:** finish **7.x** before **Step 8** fit/shell. Prior fit code was reverted; do not claim **8.x** until **7.4** is ✅.
- **Postponed polish:** **5.2** / **6.4** stay ⏸️ until a human un-postpones. Exact UI TBD then.
- **Shell / preview (Step 8):** match OD — spacious empty/loading/error; hug ASCII on success; uniform scale within viewport; equal L/R padding. Do **not** interpret “fluid” as always full-bleed empty preview.
- **Fit one place:** **8.1** fits `ascii-frame-viewer` only; compare/player get fit for free.

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
- Files: `{Ng}/src/app/components/charset-picker.ts`, `option-controls.ts`
- Do: match OD — three clickable monospace samples from API `{ id, characters }`; emit id; no name labels (Classic/…); no native radios; no “Character set” heading required; width/invert stay on option-controls
- Done when: click sample selects charset id; looks like OD options charset grid
- Commit: `frontend - ui, add charset sample picker`

---

## Step 4 — Feature: Auto-convert UX

Owns `convert-page.ts` for convert triggers (done before result-host wiring in **7.4**).

### Step 4.1 — Remove Convert button; convert on file/charset/invert

- Status: ✅
- Needs: 3.2, 3.3
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: remove Convert button; convert immediately on file / charset / invert; leave width debounce to 4.2
- Done when: no Convert button; those inputs retrigger convert
- Commit: `frontend - wire, auto-convert on file and options`

### Step 4.2 — Width debounce + cancel in-flight convert

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/utils/debounced-signal.ts`, `{Ng}/src/app/components/option-controls.ts`, `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: ~400ms width debounce via `debouncedSignal` in option-controls (charset/invert emit immediately with live width); cancel prior HTTP on new convert
- Done when: rapid width changes don’t stack; latest wins on convert
- Commit: `frontend - wire, debounce width and cancel in-flight convert`

---

## Step 5 — Feature: Image original | ASCII side-by-side

**5.1** shipped. Compose + page mount live under **Step 7**. **5.2** is deferred UI polish (after **7.x**, optionally after **8.x**).

### Step 5.1 — Image compare component

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/components/image-compare.ts`
- Do: match OD frame 3 layout — original image URL + ASCII side by side; stack on narrow (frame 6); not used for video. Use a simple scrollable `<pre>` for ASCII for now (fit deferred **Step 8**). Component-only — do not touch `convert-page` here.
- Done when: component demos side-by-side with inputs
- Commit: `frontend - ui, add image ASCII compare component`

### Step 5.2 — Rework image compare UI

- Status: ⏸️
- Needs: 7.4
- Files: `{Ng}/src/app/components/image-compare.ts` (and styles only if required)
- Do: make image-compare more UI-friendly vs the functional **5.1** layout. **Exact look TBD** in a later discussion (may wait until after **8.x** / OD pass). Do not claim while ⏸️; un-postpone after **7.4** (prefer after **8.2** if shell/fit still unsettled).
- Done when: compare UI matches the agreed look from that later discussion
- Commit: `frontend - ui, rework image compare layout`

---

## Step 6 — Feature: ASCII video player

**6.1 → 6.3** shipped. Compose + page mount live under **Step 7**. **6.4** is deferred UI polish (after page host).

### Step 6.1 — Reusable player: frame display

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/components/ascii-video-player.ts`
- Do: match OD frame 4 preview structure — input `video` (`AsciiVideo`); player owns `currentFrameIndex` (start at 0); show current frame in a simple scrollable `<pre>`; **no** transport controls yet. Fit/hug comes later in deferred **Step 8**.
- Done when: mock `AsciiVideo` shows frame 0
- Commit: `frontend - ui, add ASCII video player frame display`

### Step 6.2 — Autoplay in player

- Status: ✅
- Needs: 6.1
- Files: `{Ng}/src/app/components/ascii-video-player.ts`
- Do: on new `video` input, reset to frame 0 and set `playing`; while `playing`, advance `currentFrameIndex` on `video.frameDelayMs`; stop at last frame (no loop); **no** transport UI yet; **no** page mount
- Done when: mock `AsciiVideo` advances frames automatically in isolation
- Commit: `frontend - ui, autoplay ASCII video player`

### Step 6.3 — Transport controls on player

- Status: ✅
- Needs: 6.2
- Files: `{Ng}/src/app/components/ascii-video-player.ts`
- Do: match OD frame 4 — Play/Pause, Restart, seek bar under ASCII; drive existing `playing` / frame index; no speed; **no** page mount
- Done when: controls work in component isolation
- Commit: `frontend - ui, add ASCII video player transport controls`

### Step 6.4 — Rework video player UI

- Status: ⏸️
- Needs: 7.4
- Files: `{Ng}/src/app/components/ascii-video-player.ts` (and styles only if required)
- Do: UI adjustments after the player is on the page via **7.4** — at least transport controls; possibly more. **Exact look TBD** later. Do not claim while ⏸️; un-postpone after **7.4** (may wait until after **8.x**).
- Done when: player UI matches the agreed look from that later discussion
- Commit: `frontend - ui, rework ASCII video player controls`

---

## Step 7 — Feature: Result views decomposition

Shared frame → compose consumers in parallel → one page host leaf.

### Step 7.1 — Shared ascii-frame-viewer component

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/components/ascii-frame-viewer.ts` (**new**)
- Do: single-file component; input required `frame` (`AsciiFrame`); render monospace `<pre>` of `frame.ascii`; glyph presentation only (font/whitespace/color) — **no** intrinsic min/max size (parent owns layout/scroll); **no** loading/error/hint; **no** transport; **no** image pane. Fit deferred to **8.1**.
- Done when: component renders a mock `AsciiFrame` in isolation
- Commit: `frontend - ui, add shared ascii-frame-viewer component`

### Step 7.2 — Image compare uses ascii-frame-viewer

- Status: ✅
- Needs: 7.1, 5.1
- Files: `{Ng}/src/app/components/image-compare.ts` only
- Do: replace inner ASCII `<pre>` with `<app-ascii-frame-viewer [frame]="frame()" />`; compare inputs `imageUrl` + `frame` (`AsciiFrame`); keep original image pane + responsive grid sizing/scroll; do not touch player (page call-site may bind `frame`)
- Done when: compare still side-by-side; ASCII comes only from `ascii-frame-viewer`
- Commit: `frontend - ui, compose image compare with ascii-frame-viewer`

### Step 7.3 — Video player uses ascii-frame-viewer

- Status: ✅
- Needs: 7.1, 6.3
- Files: `{Ng}/src/app/components/ascii-video-player.ts` only
- Do: replace frame-pane `<pre>` with `<app-ascii-frame-viewer [frame]="…" />` (current `AsciiFrame` from `video.frames`); keep transport/autoplay + pane sizing/scroll; do not touch compare or `convert-page`
- Done when: player still plays; ASCII comes only from `ascii-frame-viewer`
- Commit: `frontend - ui, compose video player with ascii-frame-viewer`

### Step 7.4 — Convert page result host

- Status: ⬜
- Needs: 7.2, 7.3, 4.2
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**); delete `{Ng}/src/app/components/ascii-preview.ts` if unused
- Do: stop using `ascii-preview` for success. Page shows **loading** | **error** | empty hint | **`image-compare`** (image success: object URL + ascii; revoke URL on file change / destroy) | **`ascii-video-player`** (video success: bind `AsciiVideo`). Keep Copy/Download flatten for video (`\n\n----\n\n`). Loading/error/empty can live inline on the page (or a tiny host) — not a second ASCII renderer.
- Done when: image → compare; video → player; loading/error work; `ascii-preview` gone or unused
- Commit: `frontend - wire, convert page result host for compare and player`

---

## Step 8 — Feature: Preview fit + page shell

Gated by **Needs: 7.4**. Prior fit commit was reverted to a simple scrollable `<pre>`; re-implement fit on **`ascii-frame-viewer`** when claimed.

No preview/page scrollbars from wide ASCII; shell + preview sizing match OD (`media-to-ascii-refresh.html`).

**Split:** **8.1** = fit on `ascii-frame-viewer`. **8.2** = shell / spacious empty / hug success. **8.3** = compact Copy/Download.

### Step 8.1 — ASCII frame-viewer fit (no scrollbars)

- Status: ⬜
- Needs: 7.4
- Files: `{Ng}/src/app/components/ascii-frame-viewer.ts`
- Do: plaintext `<pre>` inside `ascii-frame-viewer`; uniform CSS scale/fit into the parent-allocated box; overflow hidden; no scrollbars. Compare/player inherit via composition — do not re-fit in those parents.
- Done when: width 200 ASCII fits pane without scrollbars in compare and player
- Commit: `frontend - ui, fit ascii-frame-viewer without scrollbars`

### Step 8.2 — Shell + preview sizing per Open Design

- Status: ⬜
- Needs: 8.1
- Files: `{Ng}/src/styles.scss`, `{Ng}/src/app/components/ascii-frame-viewer.ts`, optionally `convert-page.ts` / `app.component.ts` / compare / player
- Do: match OD `media-to-ascii-refresh.html` — equal L/R page padding; comfortable spacious region for empty/loading/error; on success hug ASCII (no large empty field beside narrow art); keep uniform scale so ASCII stays within viewport W/H; overflow hidden / no ASCII scrollbars; no asymmetric page overflow. Reference mockup ideas: `is-spacious` vs `is-hug` / fit-to-viewport (do not require identical class names).
- Done when: empty state feels like a real workspace (not a tiny compressed clump); narrow ASCII success does not leave a huge empty preview void; wide/tall ASCII fits without preview or page scrollbars; layout stays balanced vs OD frames 1 and 3
- Commit: `frontend - layout, shell and preview sizing per Open Design`

### Step 8.3 — Compact Copy / Download actions

- Status: ⬜
- Needs: 8.2
- Files: `{Ng}/src/app/components/result-actions.ts` (optionally `convert-page.ts` placement only)
- Do: shrink Copy / Download so they consume less page area. **Exact presentation TBD** when claimed (icons-only, denser row, move under result, etc.).
- Done when: actions use less page area and match the agreed compact look
- Commit: `frontend - ui, compact copy and download actions`

---

## Step 9 — Finalization

### Step 9.1 — UI polish to match Open Design

- Status: ⬜
- Needs: 7.4, 4.2, 8.3
- Files: `{Ng}/src/app/pages/**`, `components/**`, `styles.scss`
- Do: polish vs design-prompt.phase2 + OD `media-to-ascii-refresh.html`; no new features
- Done when: UI shippable vs that mockup
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
