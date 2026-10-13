# media-to-ascii

Web app that converts uploaded images and videos into ASCII art. Angular handles upload, options, preview, copy, and download; ASP.NET Core runs all conversion on the server.

## Prerequisites

- **.NET 10 SDK**
- **Node.js** (LTS)
- **FFmpeg** (required for video) — e.g. `winget install Gyan.FFmpeg`

## Stack

| Area | Choice |
|------|--------|
| Solution | Visual Studio Angular + ASP.NET Core (SPA proxy in dev) |
| Backend | .NET 10 Minimal API |
| Frontend | Angular 19 |
| Images | SixLabors.ImageSharp |
| Video frames | FFMpegCore (system **ffmpeg** / **ffprobe** required at runtime for video) |

## Run

From the solution folder (`MediaToAscii/`):

```bash
dotnet run --project MediaToAscii.Server
```

Or open `MediaToAscii/MediaToAscii.slnx` in Visual Studio and press **F5** (HTTPS profile).

Dev SPA proxy serves the Angular app (typically `https://localhost:56677`) and forwards API calls to the backend (`https://localhost:7037` / `http://localhost:5252`).

## Usage

1. Drop or choose an image or video.
2. Adjust width, invert, and charset (Classic / Detailed / Blocks).
3. Convert — ASCII appears in the preview.
4. Copy to the clipboard or download as `.txt`.

Video responses include up to 30 evenly sampled frames, separated in the plain-text body.
