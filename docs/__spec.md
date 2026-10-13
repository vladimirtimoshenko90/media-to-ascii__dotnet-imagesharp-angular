# media-to-ascii — High-Level Design

## Goal

A web app that turns uploaded images and videos into ASCII art. Frontend in Angular; conversion on an ASP.NET Core Minimal API. Pixel→character mapping stays reusable so video frames share the same core as still images.

## Stack

| Area | Choice |
|------|--------|
| Solution | Visual Studio **Angular and ASP.NET Core** (API + SPA, SPA proxy in dev) |
| Backend | **.NET** Minimal API (version from the template) |
| Frontend | **Angular** (version from the template) |
| Images | **SixLabors.ImageSharp** |
| Video frames | **FFMpegCore** (system ffmpeg may be required at runtime) |
| Name | **media-to-ascii** (`MediaToAscii` for .NET) |

## How it works

```
Browser (Angular)  →  POST multipart (media + options)  →  ASP.NET API
                                                              ↓
                                         image: load → resize → map pixels → ASCII
                                         video: sample frames → same path per frame (parallel later)
                                                              ↓
Browser  ←  text/plain  ←─────────────────────────────────────┘
```

1. User picks an image or video and conversion options in the UI.
2. Angular uploads the file and options; it does **no** media processing.
3. The API validates input, runs conversion on the backend, returns plain ASCII text.
4. The UI shows the result in a monospace preview and allows copy / download as `.txt`.

Conversion stays on the server with two concerns kept separate:

- **Pixel → character** — pure, stateless, single frame
- **Orchestration** — load/resize for images; frame extract + loop for video (parallelizable)

## Capabilities

- Upload image or video (drag-and-drop or file picker)
- Options: output width, invert luminance, character-set preset (classic / detailed / blocks)
- Preview ASCII; copy to clipboard; download `.txt`
- Video: up to 30 evenly sampled frames; multi-frame text separated in the response
- Single-page UI; minimal CSS; no UI kit

## Out of scope

Color ASCII, PNG export of ASCII, media-from-URL, auth/DB, Docker, non-trivial test suites.

## Success look like

One `dotnet run` / F5 starts API + Angular. Upload image or video → ASCII appears. Options change the output. Copy/download work. All conversion lives on the backend; the frontend only uploads, configures, and displays.

Step-by-step build order: [implementation.md](./implementation.md).
