using FFMpegCore;
using FFMpegCore.Enums;
using MediaToAscii.Server.Common;
using MediaToAscii.Server.Conversion.Entities;

namespace MediaToAscii.Server.Conversion.Services;

public interface IVideoAsciiConverter
{
    Task<AsciiVideo> Convert(Stream stream, ConvertOptions options, CancellationToken ct);
}

public sealed class VideoAsciiConverter(
    IImageAsciiConverter imageConverter,
    ITempFileUtility tempFiles) : IVideoAsciiConverter
{
    public async Task<AsciiVideo> Convert(Stream stream, ConvertOptions options, CancellationToken ct)
    {
        // Seekable temp file — pipe+seek fails with FFmpeg exit 69 on many phone MP4s.
        var videoPath = await tempFiles.Persist(stream, extension: string.Empty, ct);

        var analysis = await FFProbe.AnalyseAsync(videoPath, cancellationToken: ct);
        var duration = analysis.Duration;

        // One decode pass → real PNG files. Per-seek pipe extract fails/empties at full fps.
        var framesDir = tempFiles.CreateDirectory();
        var pattern = Path.Combine(framesDir, "frame%05d.png");
        await FFMpegArguments
            .FromFileInput(videoPath, verifyExists: true)
            .OutputToFile(pattern, overwrite: true, opts => opts
                .WithCustomArgument("-map 0:v:0")
                .WithVideoCodec(VideoCodec.Image.Png)
                .ForceFormat("image2"))
            .CancellableThrough(ct)
            .ProcessAsynchronously();

        var framePaths = Directory.GetFiles(framesDir, "frame*.png")
            .OrderBy(static p => p, StringComparer.Ordinal)
            .ToArray();

        if (framePaths.Length == 0)
        {
            throw new InvalidOperationException("FFmpeg produced no video frames.");
        }

        var frames = new AsciiFrame[framePaths.Length];
        var parallelOptions = new ParallelOptions
        {
            MaxDegreeOfParallelism = Math.Max(1, Environment.ProcessorCount),
            CancellationToken = ct,
        };

        await Parallel.ForEachAsync(
            Enumerable.Range(0, framePaths.Length),
            parallelOptions,
            async (i, token) =>
            {
                await using var png = File.OpenRead(framePaths[i]);
                frames[i] = await imageConverter.Convert(png, options, token);
            });

        var durationMs = (int)Math.Max(0, Math.Round(duration.TotalMilliseconds));
        var frameDelayMs = frames.Length > 0 && durationMs > 0
            ? Math.Max(1, (int)Math.Round((double)durationMs / frames.Length))
            : 0;
        return new AsciiVideo(frames, durationMs, frameDelayMs);
    }
}
