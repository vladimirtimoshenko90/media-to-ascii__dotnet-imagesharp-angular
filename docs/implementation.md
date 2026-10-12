# media-to-ascii implementation

## Contents

- [✅ Step 1 — Solution: scaffold](#step-1--solution-scaffold)
  - [✅ 1.1 — Create Angular + ASP.NET Core app](#step-11--create-angular--aspnet-core-app)
  - [✅ 1.2 — Boilerplate solution cleanup](#step-12--boilerplate-solution-cleanup)
  - [✅ 1.3 — Add ImageSharp and FFMpegCore](#step-13--add-imagesharp-and-ffmpegcore)
  - [✅ 1.4 — Frontend infrastructure setup](#step-14--frontend-infrastructure-setup)
- [⏳ Step 2 — Backend: contracts](#step-2--backend-contracts)
  - [✅ 2.1 — Shared models and charset defaults](#step-21--shared-models-and-charset-defaults)
  - [✅ 2.2 — Pixel → character interface](#step-22--pixel--character-interface)
  - [✅ 2.3 — Image conversion interface](#step-23--image-conversion-interface)
  - [⬜ 2.4 — Video conversion interface](#step-24--video-conversion-interface)
  - [⬜ 2.5 — DI registration (stubs ok)](#step-25--di-registration-stubs-ok)
- [⏳ Step 3 — Backend: endpoints](#step-3--backend-endpoints)
  - [✅ 3.1 — Shared form validation helper](#step-31--shared-form-validation-helper)
  - [⬜ 3.2 — Image convert endpoint](#step-32--image-convert-endpoint)
  - [⬜ 3.3 — Video convert endpoint](#step-33--video-convert-endpoint)
  - [⬜ 3.4 — Map endpoints in Program](#step-34--map-endpoints-in-program)
- [⬜ Step 4 — Backend: image processing](#step-4--backend-image-processing)
  - [⬜ 4.1 — Pixel → character implementation](#step-41--pixel--character-implementation)
  - [⬜ 4.2 — Image conversion implementation](#step-42--image-conversion-implementation)
- [⬜ Step 5 — Backend: video processing](#step-5--backend-video-processing)
  - [✅ 5.1 — Add FFMpegCore](#step-51--add-ffmpegcore)
  - [⬜ 5.2 — Sequential frame conversion](#step-52--sequential-frame-conversion)
  - [⬜ 5.3 — Parallelize frame conversion](#step-53--parallelize-frame-conversion)
- [⏳ Step 6 — Frontend: contracts and client](#step-6--frontend-contracts-and-client)
  - [✅ 6.1 — Options and charset presets](#step-61--options-and-charset-presets)
  - [⬜ 6.2 — Convert API client surface](#step-62--convert-api-client-surface)
  - [⬜ 6.3 — Image convert HTTP call + HttpClient](#step-63--image-convert-http-call--httpclient)
  - [⬜ 6.4 — Video convert HTTP call](#step-64--video-convert-http-call)
- [⬜ Step 7 — Frontend: UI components](#step-7--frontend-ui-components)
  - [⬜ 7.1 — App shell](#step-71--app-shell)
  - [⬜ 7.2 — Upload zone component](#step-72--upload-zone-component)
  - [⬜ 7.3 — Option controls component](#step-73--option-controls-component)
  - [⬜ 7.4 — ASCII preview component](#step-74--ascii-preview-component)
  - [⬜ 7.5 — Result actions component](#step-75--result-actions-component)
  - [⬜ 7.6 — Minimal global styles](#step-76--minimal-global-styles)
- [⬜ Step 8 — Frontend: wire-up](#step-8--frontend-wire-up)
  - [⬜ 8.1 — Wire image convert flow](#step-81--wire-image-convert-flow)
  - [⬜ 8.2 — Wire video convert flow](#step-82--wire-video-convert-flow)
- [⬜ Step 9 — Finalization](#step-9--finalization)
  - [⬜ 9.1 — Write project README](#step-91--write-project-readme)
  - [⬜ 9.2 — Generate app favicon](#step-92--generate-app-favicon)

### Status legend

| Icon | Meaning |
|------|---------|
| ⬜ | pending |
| ⏳ | in progress |
| 🔍 | under review |
| ✅ | completed |

### Agent playbook (read before claiming)

1. Sync Contents + body icons for the leaf you touch.
2. Claim: set leaf (and roll up parent if useful) to ⏳ **before** editing code.
3. Take the next ⬜ leaf that (a) has all **Needs** leaves ✅, and (b) **Files** do not overlap any ⏳/🔍 leaf.
4. Implement **only** that leaf; use the **Locked layout** paths below — do not invent alternate folders.
5. When done coding: 🔍. After human approves `/m2asc-ship`: mark ✅; stage only this leaf (hunk-filter the plan if mixed); verify `git diff --cached`; commit locally; do not push unless asked.
6. Commit style: `area - subarea, what was done/introduced/fixed`.

**Hot files** (serialize — never two agents at once): `{Api}/Program.cs`, `{Ng}/src/app/app.component.ts`, `{Ng}/src/app/app.config.ts`, this `docs/implementation.md` while claiming/shipping.

### Locked layout

After 1.1, resolve `{Api}` = API project folder and `{Ng}` = Angular app root (template names may vary; keep these relative folders).

```
{Api}/
  Conversion/
    ConvertOptions.cs
    VideoAsciiResult.cs
    IPixelCharMapper.cs
    IImageAsciiConverter.cs
    IVideoAsciiConverter.cs
    PixelCharMapper.cs
    ImageAsciiConverter.cs
    VideoAsciiConverter.cs
    ConversionServiceCollectionExtensions.cs
  Endpoints/
    ConvertFormValidation.cs
    ImageConvertEndpoint.cs
    VideoConvertEndpoint.cs
  Program.cs

{Ng}/src/app/
  conversion/
    convert-options.ts
    convert-api.service.ts
  components/
    upload-zone/          (upload-zone.ts + template/styles as template uses)
    option-controls/
    ascii-preview/
    result-actions/
  app.component.ts (inline template)
  app.config.ts
  app.routes.ts
  styles.scss (global)
```

### Locked contracts

| Item | Value |
|------|--------|
| Image route | `POST /api/convert/image` |
| Video route | `POST /api/convert/video` |
| Form fields | `file`, `width`, `invert`, `charset` |
| Image success | `text/plain` (ASCII body) |
| Video success | `text/plain` — one ASCII frame per block, blocks separated by `\n\n----\n\n` |
| Width clamp | 20–300 (API); UI slider 40–200 |
| Classic charset | `@%#*+=-:. ` |
| Detailed charset | `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'. ` |
| Blocks charset | `█▓▒░ ` |
| Video frames | extract with **FFMpegCore** (system ffmpeg may be required at runtime) |
| Video sampling | cap at **30 frames** max (evenly sample across the clip if longer) |
| Parallelism | `Parallel.ForEach` (or equivalent), max degree ≈ `Environment.ProcessorCount` |
| Convert action | app host provides a Convert control; components do not call HTTP themselves |

### Parallel lanes (after ✅ 1.1)

| Lane | Steps | Typical files |
|------|-------|----------------|
| A — Backend contracts/impl | 2 → 4 → 5 | `{Api}/Conversion/**` |
| B — Backend endpoints | 3 (needs 2.5 ✅) | `{Api}/Endpoints/**`, then `Program.cs` |
| C — Frontend client | 6 | `{Ng}/src/app/conversion/**`, `app.config.ts` |
| D — Frontend UI | 7 (prefer after ✅ 1.4) | `{Ng}/src/app/components/**`, shell, styles |
| E — Wire-up | 8 (needs 6–7) | app host only |
| F — Finalization | 9 (needs 8 ✅) | `README.md`, `{Ng}/public/favicon.ico` |

---

## Goal

Ship **media-to-ascii**: Angular UI uploads image/video + options; ASP.NET Minimal API converts via ImageSharp (and FFMpegCore for video frames); ASCII returned as plain text; preview / copy / download. Contract-first backend, then image impl, then video + parallel frames. Frontend: client contracts → UI components → wire-up (SCSS + Bootstrap via Step 1.4).

## Agreed decisions

- Name: **media-to-ascii** / **MediaToAscii**
- Stack: VS Angular + ASP.NET Core template, Minimal API, ImageSharp, FFMpegCore (video)
- Frontend: **Angular 19** standalone (`app.component.ts` / `app.config.ts` / `app.routes.ts`); no NgModules
- No media processing in the browser
- Pixel → character is pure and reused for every video frame
- Endpoints stay thin; services own processing
- Concrete classes may start as stubs (`NotImplementedException`) until Steps 4–5 fill them in — same types, no stub/real class rename churn

## Living plan

`docs/implementation.md` — implementation leaves only. Icons in Contents and body stay in sync. Prefer committing plan updates on `/m2asc-ship` (⬜→✅), not every ⏳/🔍 flip.

---

## Step 1 — Solution: scaffold

### Step 1.1 — Create Angular + ASP.NET Core app

- Status: ✅
- Needs: —
- Files: repo root (`*.sln`, `{Api}/**`, `{Ng}/**` as template generates)
- Do: scaffold **MediaToAscii** (Angular + ASP.NET Core) into this repo; keep existing `docs/`, `README.md`, `.gitignore`
- Done when: solution builds
- Commit: `solution - scaffold, create MediaToAscii Angular and ASP.NET app`

### Step 1.2 — Boilerplate solution cleanup

- Status: ✅
- Needs: 1.1
- Files: template leftovers under `{Api}/**`, `{Ng}/**`, root `.gitignore`, this plan as needed
- Do: strip weather demo, unused test infra, template docs/changelogs, consolidate gitignore, trim harmless template extras; keep SPA start scripts and routing intact; app must still run
- Done when: no weather residue; template noise removed; `dotnet run` / F5 still starts API + Angular
- Commit: `solution - cleanup, strip template boilerplate from MediaToAscii app`

### Step 1.3 — Add ImageSharp and FFMpegCore

- Status: ✅
- Needs: 1.2
- Files: `{Api}/*.csproj`
- Do: add `SixLabors.ImageSharp` and `FFMpegCore` (video frame extraction later; system ffmpeg may still be required at runtime)
- Done when: both packages referenced; restore ok
- Commit: `backend - deps, add ImageSharp and FFMpegCore`

### Step 1.4 — Frontend infrastructure setup

- Status: ✅
- Needs: 1.2
- Files: `{Ng}/angular.json`, `{Ng}/package.json`, `{Ng}/src/styles.css` → `{Ng}/src/styles.scss`
- Do: switch the Angular app to **SCSS**; add **Bootstrap** and **Bootstrap Icons**; import them in global styles; keep SPA `npm start` scripts intact; app must still run
- Done when: SCSS is the style format; Bootstrap utilities and icons are available globally
- Commit: `frontend - setup, add SCSS Bootstrap and icons`

---

## Step 2 — Backend: contracts

Interfaces + models + concrete class shells (stub bodies ok) + DI extension. **No** ImageSharp/ffmpeg logic yet.

### Step 2.1 — Shared models and charset defaults

- Status: ✅
- Needs: 1.1
- Files: `{Api}/Conversion/ConvertOptions.cs`, `{Api}/Conversion/VideoAsciiResult.cs`
- Do: `ConvertOptions` (Width=100, Invert=false, Charset=Classic); `VideoAsciiResult` holding ordered frame strings (endpoint can join with the locked separator)
- Done when: models compile
- Commit: `backend - contracts, add conversion models`

### Step 2.2 — Pixel → character interface

- Status: ✅
- Needs: 2.1
- Files: `{Api}/Conversion/IPixelCharMapper.cs`, `{Api}/Conversion/PixelCharMapper.cs`
- Do: interface for mapping luminance/pixels → charset chars; class stub throws until 4.1
- Done when: injectable type exists; no I/O
- Commit: `backend - contracts, add pixel mapper interface`

### Step 2.3 — Image conversion interface

- Status: ✅
- Needs: 2.1
- Files: `{Api}/Conversion/IImageAsciiConverter.cs`, `{Api}/Conversion/ImageAsciiConverter.cs`
- Do: `Task<string>` or `string` Convert(Stream, ConvertOptions); stub until 4.2
- Done when: interface + stub class compile
- Commit: `backend - contracts, add image converter interface`

### Step 2.4 — Video conversion interface

- Status: ⬜
- Needs: 2.1
- Files: `{Api}/Conversion/IVideoAsciiConverter.cs`, `{Api}/Conversion/VideoAsciiConverter.cs`
- Do: Convert(Stream, ConvertOptions) → `VideoAsciiResult`; stub until 5.2
- Done when: interface + stub class compile
- Commit: `backend - contracts, add video converter interface`

### Step 2.5 — DI registration (stubs ok)

- Status: ⬜
- Needs: 2.2, 2.3, 2.4
- Files: `{Api}/Conversion/ConversionServiceCollectionExtensions.cs`, `{Api}/Program.cs`
- Do: `AddConversionServices()` registers the three concrete types; call it from `Program.cs`
- Done when: services resolve from DI
- Commit: `backend - di, register conversion services`

---

## Step 3 — Backend: endpoints

Thin Minimal API. Handlers call interfaces only. Prefer endpoint files owning logic so `Program.cs` stays a short map call (3.4).

### Step 3.1 — Shared form validation helper

- Status: ✅
- Needs: 2.1
- Files: `{Api}/Endpoints/ConvertFormValidation.cs`
- Do: parse/clamp width 20–300; require non-empty file; build `ConvertOptions`; return plain-text error messages for 400s
- Done when: helper usable by both endpoints
- Commit: `backend - api, add convert form validation`

### Step 3.2 — Image convert endpoint

- Status: ⬜
- Needs: 2.3, 2.5, 3.1
- Files: `{Api}/Endpoints/ImageConvertEndpoint.cs`
- Do: `MapImageConvert` → `POST /api/convert/image`; multipart → validate → `IImageAsciiConverter` → `text/plain`; 400 on bad input
- Done when: extension method ready (not necessarily mapped in Program yet)
- Commit: `backend - api, add image convert endpoint`

### Step 3.3 — Video convert endpoint

- Status: ⬜
- Needs: 2.4, 2.5, 3.1
- Files: `{Api}/Endpoints/VideoConvertEndpoint.cs`
- Do: `MapVideoConvert` → `POST /api/convert/video`; same form fields; join frames with `\n\n----\n\n`; `text/plain`; 400 on bad input
- Done when: extension method ready
- Commit: `backend - api, add video convert endpoint`

### Step 3.4 — Map endpoints in Program

- Status: ⬜
- Needs: 3.2, 3.3
- Files: `{Api}/Program.cs`
- Do: `app.MapImageConvert();` `app.MapVideoConvert();` (names as implemented)
- Done when: both routes registered
- Commit: `backend - api, map convert endpoints in Program`

---

## Step 4 — Backend: image processing

Fill stub bodies. **Do not** change endpoint or DI type mappings unless broken.

### Step 4.1 — Pixel → character implementation

- Status: ⬜
- Needs: 2.2
- Files: `{Api}/Conversion/PixelCharMapper.cs`
- Do: luminance `0.299R+0.587G+0.114B`, normalize, optional invert, charset index; comment the formula
- Done when: stub replaced with real pure mapping
- Commit: `backend - image, implement pixel to character mapping`

### Step 4.2 — Image conversion implementation

- Status: ⬜
- Needs: 1.3, 4.1
- Files: `{Api}/Conversion/ImageAsciiConverter.cs`
- Do: ImageSharp load → height `width * (h/w) * 0.5` (comment aspect fix) → resize → row walk via mapper → ASCII string
- Done when: image endpoint returns real ASCII for a JPG/PNG
- Commit: `backend - image, implement image to ASCII converter`

---

## Step 5 — Backend: video processing

Reuse image/pixel pieces; then parallelize the frame loop only.

### Step 5.1 — Add FFMpegCore

- Status: ✅
- Needs: 1.3
- Files: `{Api}/*.csproj`
- Do: ~~add `FFMpegCore` for frame extraction~~ — done in **1.3** (same csproj PackageReference)
- Done when: package referenced
- Commit: _(included in 1.3)_

### Step 5.2 — Sequential frame conversion

- Status: ⬜
- Needs: 4.2, 5.1, 2.4
- Files: `{Api}/Conversion/VideoAsciiConverter.cs`
- Do: extract frames (max 30, evenly sampled) → convert each via `IImageAsciiConverter` (or shared resize+map path) → `VideoAsciiResult` in order; single-threaded loop
- Done when: video endpoint returns multi-frame ASCII text
- Commit: `backend - video, implement sequential frame conversion`

### Step 5.3 — Parallelize frame conversion

- Status: ⬜
- Needs: 5.2
- Files: `{Api}/Conversion/VideoAsciiConverter.cs`
- Do: parallelize frame→ASCII only; preserve frame order in the result; do not change `PixelCharMapper`
- Done when: parallel path works; ordering stable
- Commit: `backend - video, parallelize frame to ASCII conversion`

---

## Step 6 — Frontend: contracts and client

No UI chrome here — types + HTTP only.

### Step 6.1 — Options and charset presets

- Status: ✅
- Needs: 1.1
- Files: `{Ng}/src/app/conversion/convert-options.ts`
- Do: options type; Classic / Detailed / Blocks strings (must match backend); UI defaults (width 100, invert false)
- Done when: exported for service + components
- Commit: `frontend - contracts, add options and charset presets`

### Step 6.2 — Convert API client surface

- Status: ⬜
- Needs: 6.1
- Files: `{Ng}/src/app/conversion/convert-api.service.ts`
- Do: injectable service with `convertImage(...)` and `convertVideo(...)` method signatures (bodies can stub/throw until 6.3–6.4)
- Done when: service injectable skeleton exists
- Commit: `frontend - contracts, add convert API service surface`

### Step 6.3 — Image convert HTTP call + HttpClient

- Status: ⬜
- Needs: 6.2
- Files: `{Ng}/src/app/conversion/convert-api.service.ts`, `{Ng}/src/app/app.config.ts`
- Do: provide `HttpClient`; implement `convertImage` → `FormData` POST `/api/convert/image`, `responseType: 'text'`
- Done when: image method performs the HTTP call
- Commit: `frontend - api, implement image convert client`

### Step 6.4 — Video convert HTTP call

- Status: ⬜
- Needs: 6.3
- Files: `{Ng}/src/app/conversion/convert-api.service.ts`
- Do: `convertVideo` → POST `/api/convert/video`, `responseType: 'text'`
- Done when: video method performs the HTTP call
- Commit: `frontend - api, implement video convert client`

---

## Step 7 — Frontend: UI components

One concern per folder so agents can work in parallel. Shell only composes; no convert HTTP in this step. Prefer SCSS + Bootstrap from **1.4**.

### Step 7.1 — App shell

- Status: ⬜
- Needs: 1.4
- Files: `{Ng}/src/app/app.component.ts`
- Do: single-page host with slots/placeholders for upload, options, preview, actions (children may be empty stubs)
- Done when: shell renders
- Commit: `frontend - ui, add app shell`

### Step 7.2 — Upload zone component

- Status: ⬜
- Needs: 1.4
- Files: `{Ng}/src/app/components/upload-zone/*`
- Do: drag-and-drop + file input; accept image/* and video/*; emit selected `File`
- Done when: component usable standalone
- Commit: `frontend - ui, add upload zone component`

### Step 7.3 — Option controls component

- Status: ⬜
- Needs: 1.4, 6.1
- Files: `{Ng}/src/app/components/option-controls/*`
- Do: width slider 40–200, invert checkbox, charset dropdown; emit options changes
- Done when: component binds and emits
- Commit: `frontend - ui, add option controls component`

### Step 7.4 — ASCII preview component

- Status: ⬜
- Needs: 1.4
- Files: `{Ng}/src/app/components/ascii-preview/*`
- Do: `<pre>` monospace, `line-height: 1`; inputs for text, loading, error
- Done when: shows bound text / loading / error
- Commit: `frontend - ui, add ASCII preview component`

### Step 7.5 — Result actions component

- Status: ⬜
- Needs: 1.4
- Files: `{Ng}/src/app/components/result-actions/*`
- Do: copy clipboard + download `.txt` given current text input; use Bootstrap Icons where helpful
- Done when: both actions work
- Commit: `frontend - ui, add result actions component`

### Step 7.6 — Minimal global styles

- Status: ⬜
- Needs: 1.4
- Files: `{Ng}/src/styles.scss`
- Do: light page layout on top of SCSS + Bootstrap from 1.4 (no custom design system)
- Done when: global styles applied
- Commit: `frontend - ui, add minimal global styles`

---

## Step 8 — Frontend: wire-up

Compose components + call convert service. **Only** the app host owns orchestration state.

### Step 8.1 — Wire image convert flow

- Status: ⬜
- Needs: 6.3, 7.1–7.5
- Files: `{Ng}/src/app/app.component.ts`
- Do: host upload/options/preview/actions + Convert control; on convert (image file) call `convertImage`; set preview/loading/error
- Done when: image path is wired end-to-end in the UI
- Commit: `frontend - wire, connect image convert flow`

### Step 8.2 — Wire video convert flow

- Status: ⬜
- Needs: 6.4, 8.1
- Files: `{Ng}/src/app/app.component.ts`
- Do: when file is video, call `convertVideo`; show returned multi-frame text in preview
- Done when: video path is wired end-to-end in the UI
- Commit: `frontend - wire, connect video convert flow`

---

## Step 9 — Finalization

Polish project presentation after the app works end-to-end.

### Step 9.1 — Write project README

- Status: ⬜
- Needs: 8.2
- Files: root `README.md`
- Do: replace the placeholder README with a short final doc — what the app does, stack, how to run (`dotnet run` / F5), and basic usage
- Done when: README is accurate for the finished app
- Commit: `docs - readme, write final project README`

### Step 9.2 — Generate app favicon

- Status: ⬜
- Needs: 8.2
- Files: `{Ng}/public/favicon.ico` (and related icon assets if needed)
- Do: create a simple favicon that fits **media-to-ascii** (ASCII / media theme); wire it in `index.html` if paths change
- Done when: browser tab shows the new favicon
- Commit: `frontend - assets, add media-to-ascii favicon`

---

## Out of scope

- Color ASCII, PNG export of ASCII, URL input
- Auth, DB, Docker
- Non-trivial automated test suites
- Manual browser QA (owner: you)
