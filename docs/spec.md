# media-to-ascii — High-Level Design

## Goal

A web app that turns uploaded images into ASCII art. v1 is images only; the design must allow video → ASCII later without reworking the conversion core or the frontend upload contract.

## Stack

| Area | Choice |
|------|--------|
| Solution | Visual Studio **Angular and ASP.NET Core** (API + SPA, SPA proxy in dev) |
| Backend | **.NET** Minimal API (version from the template) |
| Frontend | **Angular** (version from the template) |
| Images | **SixLabors.ImageSharp** |
| Name | **media-to-ascii** (`MediaToAscii` for .NET) |

## How it works

```
Browser (Angular)  →  POST multipart (image + options)  →  ASP.NET API
                                                              ↓
                                                    load → resize → map pixels → ASCII text
                                                              ↓
Browser  ←  text/plain  ←─────────────────────────────────────┘
```

1. User picks an image and conversion options in the UI.
2. Angular uploads the file and options; it does **no** image processing.
3. The API validates input, runs conversion on the backend, returns plain ASCII text.
4. The UI shows the result in a monospace preview and allows copy / download as `.txt`.

Conversion stays on the server in a reusable backend module with two concerns kept separate:

- **Pixel → character** — pure, single-frame mapping (reusable for video frames later)
- **Orchestration** — load, resize, walk pixels, assemble output (images now; frame loop later)

v1 stays single-threaded; orchestration should be easy to parallelize later without touching the pixel→char logic.

## Capabilities (v1)

- Upload image (drag-and-drop or file picker; common formats such as JPG/PNG)
- Options: output width, invert luminance, character-set preset (classic / detailed / blocks)
- Preview ASCII in the page
- Copy to clipboard and download as `.txt`
- Single-page UI; minimal CSS; no UI kit

## Out of scope (v1)

Video, color ASCII, image-from-URL, PNG export of ASCII, auth/DB, Docker, and non-trivial test suites.

## Success look like

One `dotnet run` / F5 starts API + Angular. Upload an image → ASCII appears quickly. Options change the output. Copy/download work. All conversion lives on the backend; the frontend only uploads, configures, and displays.
