# media-to-ascii — High-Level Design

## Goal

A web app that turns uploaded images and videos into ASCII art. Frontend in Angular; conversion on an ASP.NET Core Minimal API. Pixel→character mapping stays reusable so video frames share the same core as still images.

## Stack

| Area | Choice |
|------|--------|
| Solution | Visual Studio **Angular and ASP.NET Core** (API + SPA, SPA proxy in dev) |
| Backend | **.NET 10** Minimal API |
| Frontend | **Angular 19** |
| Images | **SixLabors.ImageSharp** |
| Video frames | **FFMpegCore** (system `ffmpeg` / `ffprobe` required on PATH for video) |
| Name | **media-to-ascii** (`MediaToAscii` for .NET) |

## How it works

```
Browser (Angular)  →  POST multipart (file + options)  →  ASP.NET API
                                                              ↓
                                         image: load → resize → map pixels → AsciiFrame
                                         video: temp file → sample frames → AsciiVideo
                                                              ↓
Browser  ←  JSON (AsciiFrame | AsciiVideo)  ←────────────────┘
```

1. User drops or picks an image or video; options (width, invert, charset) live in the sidebar once a file is chosen.
2. Angular **auto-converts** on file / charset / invert (immediate) and on width (debounced); it cancels in-flight requests. It does **no** media processing.
3. The API validates the form (FluentValidation), runs conversion on the backend, returns typed JSON.
4. The UI shows natural-size monospace ASCII: still image via `image-ascii-result`, video via `ascii-video-player` (timed frames). **Copy** exports the current visible frame only (no download).

Conversion stays on the server with two concerns kept separate:

- **Pixel → character** — pure, stateless, single frame (`AsciiCharsetType` → glyphs)
- **Orchestration** — load/resize for images; temp-file frame extract + loop for video

## API contracts (phase 2)

| Item | Value |
|------|--------|
| Options | `GET /api/config/convert-options` → `[{ "id", "characters" }, …]` (`classic` / `detailed` / `blocks`) |
| Convert | `POST /api/convert/image`, `POST /api/convert/video` |
| Form fields | `file`, `width` (20–300), `invert`, `charset` (**id**, not glyphs) |
| Image JSON | `{ "ascii": "..." }` |
| Video JSON | `{ "frames": [{ "ascii": "..." }, …], "durationMs", "frameDelayMs" }` |
| Errors | `ValidationProblem` |
| Video limits | max 30 evenly sampled frames; system ffmpeg |

## Capabilities

- Upload image or video (centered drop zone first; tool layout after pick)
- Options: width (UI 40–200, default 100), invert luminance, charset **sample picker** (glyphs from API; no name labels)
- Auto-convert — no Convert button; width ~400ms debounce; cancel prior request
- Sidebar **source preview** (image still / muted video scrubbed to ASCII player frame) + replace-file control
- Result: natural-size ASCII; Copy icon on the frame (`bi-copy`); video transport (play/pause, 2×, restart, seek) under ASCII
- Shell grows with content up to the viewport; wider ASCII scrolls horizontally inside the frame
- UI target: Open Design **Media to Ascii** / `media-to-ascii-refresh.html` (D1–D5)

## Out of scope

Color ASCII, PNG export of ASCII, media-from-URL, auth/DB, Docker, bundling ffmpeg, non-trivial test suites.

## Success looks like

One `dotnet run` / F5 starts API + Angular. Upload image or video → ASCII appears without a Convert click. Options and charset samples change the output. Video plays through sampled frames with transport controls. Copy puts the current frame on the clipboard. All conversion lives on the backend; the frontend only uploads, configures, and displays.

## Plans & process

- Active build order: [implementation.md](./implementation.md) (phase 2)
- Phase 1 archive: [implementation.phase1.md](./implementation.phase1.md)
- Agent / docs process: [__workflow.md](./__workflow.md)
- UI brief (historical if it conflicts with OD HTML): [design-prompt.phase2.md](./design-prompt.phase2.md)
