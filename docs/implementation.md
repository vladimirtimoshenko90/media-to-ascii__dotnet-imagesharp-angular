# media-to-ascii implementation (phase 2)

Living plan — **feature-centric**: each top-level Step is one feature; leaves are atomic slices of that feature.  
**Agents: this file is the full brief.** Do not rely on chat history. Read `docs/__workflow.md`, `docs/__spec.md`, and [design-prompt.phase2.md](./design-prompt.phase2.md). Phase 1 archive: [implementation.phase1.md](./implementation.phase1.md).

## Contents

- [⬜ Step 1 — Feature: Convert API cleanup](#step-1--feature-convert-api-cleanup)
  - [✅ 1.1 — FluentValidation + convert form request](#step-11--fluentvalidation--convert-form-request)
  - [✅ 1.2 — Charsets / convert-options GET endpoint](#step-12--charsets--convert-options-get-endpoint)
  - [✅ 1.3 — Typed JSON convert responses](#step-13--typed-json-convert-responses)
- [⬜ Step 2 — Feature: Reliable video convert](#step-2--feature-reliable-video-convert)
  - [✅ 2.1 — Temp file utility](#step-21--temp-file-utility)
  - [✅ 2.2 — Extract video frames via temp file](#step-22--extract-video-frames-via-temp-file)
- [⬜ Step 3 — Feature: Charsets from API + sample picker](#step-3--feature-charsets-from-api--sample-picker)
  - [✅ 3.1 — Cleanup: do not hard-code ASCII charsets on FE; load from API](#step-31--cleanup-do-not-hard-code-ascii-charsets-on-fe-load-from-api)
  - [⬜ 3.2 — FE consume typed JSON convert results](#step-32--fe-consume-typed-json-convert-results)
  - [⬜ 3.3 — Charset sample picker UI](#step-33--charset-sample-picker-ui)
- [⏳ Step 4 — Feature: Preview fit + page shell](#step-4--feature-preview-fit--page-shell)
  - [✅ 4.1 — ASCII preview fit (no scrollbars)](#step-41--ascii-preview-fit-no-scrollbars)
  - [⬜ 4.2 — Balanced fluid shell layout](#step-42--balanced-fluid-shell-layout)
- [⬜ Step 5 — Feature: Image original | ASCII side-by-side](#step-5--feature-image-original--ascii-side-by-side)
  - [⬜ 5.1 — Image compare component](#step-51--image-compare-component)
  - [⬜ 5.2 — Wire image compare on convert page](#step-52--wire-image-compare-on-convert-page)
- [⬜ Step 6 — Feature: ASCII video player](#step-6--feature-ascii-video-player)
  - [⬜ 6.1 — Reusable player: frame display](#step-61--reusable-player-frame-display)
  - [⬜ 6.2 — Replace page video result with player](#step-62--replace-page-video-result-with-player)
  - [⬜ 6.3 — Transport controls on player](#step-63--transport-controls-on-player)
  - [⬜ 6.4 — Autoplay on video convert success](#step-64--autoplay-on-video-convert-success)
- [⬜ Step 7 — Feature: Auto-convert UX](#step-7--feature-auto-convert-ux)
  - [⬜ 7.1 — Remove Convert button; convert on file/charset/invert](#step-71--remove-convert-button-convert-on-filecharsetinvert)
  - [⬜ 7.2 — Width debounce + cancel in-flight convert](#step-72--width-debounce--cancel-in-flight-convert)
- [⬜ Step 8 — Finalization](#step-8--finalization)
  - [⬜ 8.1 — UI polish to match Open Design](#step-81--ui-polish-to-match-open-design)
  - [⬜ 8.2 — README adjust for new behavior](#step-82--readme-adjust-for-new-behavior)
  - [⬜ 8.3 — README sample ASCII](#step-83--readme-sample-ascii)
  - [⬜ 8.4 — Refresh __spec.md](#step-84--refresh-__specmd)
  - [⬜ 8.5 — Archive this plan as implementation.phase2.md](#step-85--archive-this-plan-as-implementationphase2md)

### Reminders (human — not ship leaves)

- On **5.1** / **6.1**: if ASCII scale-to-fit is copied from `ascii-preview`, extract a shared directive or fitted-`<pre>` component (details under Agreed decisions)

### Status legend

| Icon | Meaning |
|------|---------|
| ⬜ | pending |
| ⏳ | in progress |
| 🔍 | under review |
| ✅ | completed |

### Agent playbook (read before claiming)

1. Sync Contents + body icons for the leaf you touch.
2. Claim: set leaf to ⏳ **before** editing code.
3. Next ⬜ leaf only if all **Needs** are ✅ and **Files** do not overlap any ⏳/🔍 leaf (respect **Hot files**).
4. Implement **only** that leaf; obey **Locked layout** / **Locked contracts**.
5. Done coding → 🔍; propose commit message; **do not** commit unless `/m2asc-ship` or explicit “commit …”.
6. Commit style: `area - subarea, what was done/introduced/fixed`. **Never push.**
7. Follow `.cursor/rules/` (backend/frontend style, no-commit, no-push).

**Hot files** (one agent at a time):  
`{Api}/Program.cs`, `{Api}/Conversion/DependencyInjection.cs`, `{Api}/Common/DependencyInjection.cs`, `{Ng}/src/app/pages/convert-page.ts`, `{Ng}/src/app/app.config.ts`, `{Ng}/src/styles.scss`, `{Ng}/src/app/services/convert-api.service.ts`, this `docs/implementation.md` while claiming/shipping.

### Suggested parallel waves (~3 agents)

Feature steps can advance in parallel when Needs/Files allow.

| Wave | Agent A | Agent B | Agent C |
|------|---------|---------|---------|
| 1 | **1.1** FluentValidation | **2.1** TempFileUtility | **4.1** Preview fit |
| 2 | **1.2** Options GET | **2.2** Video temp extract (needs 2.1) | **4.2** Shell layout (needs 4.1) |
| 3 | **1.3** JSON responses (needs 1.1) | **3.1** FE charset cleanup (needs 1.2) | **5.1** Image compare component (needs 4.1) |
| 4 | **3.2** FE JSON client (needs 1.3) | **3.3** Charset picker (needs 3.1) | **6.1** Player frame display (needs 4.1) |
| 5 | **6.2** Page uses player (needs 3.2, 6.1) | **5.2** Wire image compare (needs 5.1, 3.2) | **6.3** Player controls (needs 6.1) |
| 6 | **7.1 → 7.2** Auto-convert on `convert-page` (one agent; needs 3.3, 3.2) | **6.4** Autoplays (needs 6.3, 6.2) | — |
| 7 | **8.x** Finalization | — | — |

Prefer fewer parallel claims over conflicts.

---

## Context for cold-start agents (today → target)

### What already works (phase 1)

- Angular 19 + ASP.NET Minimal API (.NET 10); ImageSharp; FFMpegCore.
- `POST /api/convert/image|video` multipart: `file`, `width`, `invert`, `charset` (**charset = full glyph string today**).
- Success today: **`text/plain`** (video frames joined with `\n\n----\n\n`).
- UI: Convert button; charset dropdown; hard-coded glyphs in `{Ng}/src/app/constants/ascii-charsets.ts`; single `<pre>` preview (can scroll/overflow).
- `{Api}` = `MediaToAscii/MediaToAscii.Server`, `{Ng}` = `MediaToAscii/mediatoascii.client`.

### Known bug (Step 2)

- Video fails FFmpeg exit **69** with **pipe + seek**. Fix: temp seekable file + system `ffmpeg`/`ffprobe` on PATH. FFMpegCore NuGet does not ship binaries.

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
      AsciiVideo.cs                   # Step 1.3
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
  constants/default-convert-options.ts
  components/
    upload-zone.ts
    option-controls.ts                # width + invert
    charset-picker.ts                 # Step 3.3
    ascii-preview.ts                  # Step 4.1
    image-compare.ts                  # Step 5.1
    ascii-video-player.ts             # Steps 6.1 / 6.3
    result-actions.ts
  pages/convert-page.ts               # Steps 5.2, 6.2, 6.4, 7.x
  app.component.ts
  app.config.ts
  styles.scss
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
| Video JSON | `{ "frames": [ { "ascii": "..." }, ... ] }` (`AsciiVideo`) |
| Validation errors | `Results.ValidationProblem(...)` |
| Width | API 20–300 (required on convert form); UI 40–200; FE default 100 |
| Default charset id | FE default `classic` (API requires charset on convert form) |
| Video | max 30 frames; even sample; system ffmpeg |
| Temp files | Guid path under temp; scoped dispose deletes |
| FE debounce | Width ~400ms; file/charset/invert immediate |
| FE cancel | Cancel prior convert on new request |
| Copy/Download | Join video frame `.ascii` strings with `\n\n----\n\n` |
| Player | ~120ms/frame; Play/Pause, Restart, seek; no speed; autoplay on success |
| Preview | Plaintext + CSS fit; no scrollbars |
| Design | [design-prompt.phase2.md](./design-prompt.phase2.md) |

**Mapper note:** HTTP parses charset **id → `AsciiCharsetType` once** (validator/form boundary); `ConvertOptions.Charset` is the enum; mapper uses `charset.GetGlyphs()`.

---

## Goal

Feature-complete phase 2: reliable video; API-owned charsets + picker; JSON convert; fit preview/shell; image side-by-side; ASCII video player with controls + autoplay; auto-convert; docs/spec; archive plan.

## Agreed decisions

- Plan is **feature-centric** (Step = feature).
- No Convert button; auto-convert.
- Charset UI: clickable samples only (no name labels, no native radios).
- Image side-by-side; video = ASCII player only (no raw video pane).
- Never commit unless asked / `/m2asc-ship`; never push.
- **Defer:** keep ASCII scale-to-fit inside `ascii-preview` for 4.1; when implementing **5.1** / **6.1**, if fit logic is copied, extract a shared directive (or tiny fitted-`<pre>` component) — do not invent that file until a second consumer needs it.

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

- Status: ⬜
- Needs: 1.3
- Files: `{Ng}/src/app/services/convert-api.service.ts`, minimal page typing
- Do: JSON `AsciiFrame` / `AsciiVideo` (`ascii` / `frames[].ascii`); not `responseType: 'text'`; page still compiles
- Done when: client parses JSON convert responses
- Commit: `frontend - api, consume JSON convert responses`

### Step 3.3 — Charset sample picker UI

- Status: ⬜
- Needs: 3.1
- Files: `{Ng}/src/app/components/charset-picker.ts`, `option-controls.ts`
- Do: clickable monospace samples from API `{ id, characters }`; emit id; no labels; no native radios; width/invert stay on option-controls
- Done when: click sample selects charset id
- Commit: `frontend - ui, add charset sample picker`

---

## Step 4 — Feature: Preview fit + page shell

No preview/page scrollbars from wide ASCII; balanced layout.

### Step 4.1 — ASCII preview fit (no scrollbars)

- Status: ✅
- Needs: —
- Files: `{Ng}/src/app/components/ascii-preview.ts`
- Do: plaintext `<pre>`; uniform CSS scale/fit; overflow hidden; no scrollbars
- Done when: width 200 ASCII fits pane without scrollbars
- Commit: `frontend - ui, fit ASCII preview without scrollbars`
- Later: do **not** extract fit into a directive/service in this leaf — reconsider on **5.1** / **6.1** if duplicated (see Agreed decisions)

### Step 4.2 — Balanced fluid shell layout

- Status: ⬜
- Needs: 4.1
- Files: `{Ng}/src/app/pages/convert-page.ts`, `app.component.ts`, `styles.scss`
- Do: balanced L/R padding; fluid width toward full viewport; no right-only overflow
- Done when: wide ASCII does not force asymmetric page scrollbar
- Commit: `frontend - layout, balanced fluid shell for preview`

---

## Step 5 — Feature: Image original | ASCII side-by-side

### Step 5.1 — Image compare component

- Status: ⬜
- Needs: 4.1
- Files: `{Ng}/src/app/components/image-compare.ts`
- Do: original image URL + ascii side by side; stack on narrow; not used for video; reuse 4.1 fit (extract shared fit directive/component only if copying logic — see Agreed decisions)
- Done when: component demos side-by-side with inputs
- Commit: `frontend - ui, add image ASCII compare component`

### Step 5.2 — Wire image compare on convert page

- Status: ⬜
- Needs: 5.1, 3.2
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: on image success show compare (object URL + ascii); revoke URL on file change; video path unchanged for now
- Done when: image convert shows original | ASCII on the page
- Commit: `frontend - wire, use image compare on convert page`

---

## Step 6 — Feature: ASCII video player

Order: reusable display → page swap → controls → autoplay.

### Step 6.1 — Reusable player: frame display

- Status: ⬜
- Needs: 4.1
- Files: `{Ng}/src/app/components/ascii-video-player.ts`
- Do: inputs `frames`, `currentIndex`; show fitted frame only; **no** transport controls yet; reuse 4.1 fit (extract shared fit directive/component only if copying logic — see Agreed decisions)
- Done when: mock frames + index render correctly
- Commit: `frontend - ui, add ASCII video player frame display`

### Step 6.2 — Replace page video result with player

- Status: ⬜
- Needs: 6.1, 3.2
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: video success binds `frames` into player instead of one joined `<pre>` blob; Copy/Download still flatten with `----`
- Done when: video convert shows player frame view on the page
- Commit: `frontend - wire, show video results in ASCII player`

### Step 6.3 — Transport controls on player

- Status: ⬜
- Needs: 6.1
- Files: `{Ng}/src/app/components/ascii-video-player.ts`
- Do: Play/Pause, Restart, seek bar; ~120ms/frame; no speed
- Done when: controls work in component isolation
- Commit: `frontend - ui, add ASCII video player transport controls`

### Step 6.4 — Autoplay on video convert success

- Status: ⬜
- Needs: 6.2, 6.3
- Files: `{Ng}/src/app/pages/convert-page.ts`, `ascii-video-player.ts`
- Do: on new video result, start playback without clicking Play
- Done when: convert video → autoplay
- Commit: `frontend - wire, autoplay ASCII video on convert`

---

## Step 7 — Feature: Auto-convert UX

### Step 7.1 — Remove Convert button; convert on file/charset/invert

- Status: ⬜
- Needs: 3.2, 3.3
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: remove Convert button; convert immediately on file / charset / invert; leave width debounce to 7.2
- Done when: no Convert button; those inputs retrigger convert
- Commit: `frontend - wire, auto-convert on file and options`

### Step 7.2 — Width debounce + cancel in-flight convert

- Status: ⬜
- Needs: 7.1
- Files: `{Ng}/src/app/pages/convert-page.ts` (**hot**)
- Do: ~400ms width debounce; cancel prior HTTP on new convert
- Done when: rapid width changes don’t stack; latest wins
- Commit: `frontend - wire, debounce width and cancel in-flight convert`

---

## Step 8 — Finalization

### Step 8.1 — UI polish to match Open Design

- Status: ⬜
- Needs: 5.2, 6.4, 7.2, 4.2
- Files: `{Ng}/src/app/pages/**`, `components/**`, `styles.scss`
- Do: polish vs design-prompt.phase2 (+ OD artifact if any); no new features
- Done when: UI shippable vs brief
- Commit: `frontend - ui, polish to phase2 Open Design`

### Step 8.2 — README adjust for new behavior

- Status: ⬜
- Needs: 7.1
- Files: `README.md`
- Do: auto-convert, FFmpeg, player — concise
- Done when: README accurate
- Commit: `docs - readme, update for phase2 UX`

### Step 8.3 — README sample ASCII

- Status: ⬜
- Needs: 8.2
- Files: `README.md`
- Do: short sample at bottom
- Done when: sample on GitHub
- Commit: `docs - readme, add sample ASCII output`

### Step 8.4 — Refresh __spec.md

- Status: ⬜
- Needs: 7.1, 1.3
- Files: `docs/__spec.md`
- Do: phase 2 capabilities/contracts; correct plan links
- Done when: spec matches product
- Commit: `docs - spec, refresh for phase2`

### Step 8.5 — Archive this plan as implementation.phase2.md

- Status: ⬜
- Needs: all other phase-2 leaves ✅
- Files: `docs/implementation.md` → `docs/implementation.phase2.md`
- Do: rename per `__workflow.md`
- Done when: archive exists; active plan file gone
- Commit: `docs - plan, archive phase2 implementation`

---

## Out of scope

- Color ASCII, PNG export, media-from-URL
- Auth, DB, Docker, bundling ffmpeg
- Non-trivial automated tests
- Push to remote (human-only)
- Editing phase-1 archives except broken-link fixes
