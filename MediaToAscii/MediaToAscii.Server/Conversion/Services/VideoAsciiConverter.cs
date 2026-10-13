using FFMpegCore;
using FFMpegCore.Enums;
using FFMpegCore.Pipes;
using MediaToAscii.Server.Common;
using MediaToAscii.Server.Conversion;

namespace MediaToAscii.Server.Conversion.Services;

public interface IVideoAsciiConverter
{
    Task<VideoAsciiResult> Convert(Stream stream, ConvertOptions options, CancellationToken ct);
}

public sealed class VideoAsciiResult
{
    public IReadOnlyList<string> Frames { get; init; } = [];
}

public sealed class VideoAsciiConverter(
    IImageAsciiConverter imageConverter,
    ITempFileUtility tempFiles) : IVideoAsciiConverter
{
    public const int MaxFrames = 30;

    public async Task<VideoAsciiResult> Convert(Stream stream, ConvertOptions options, CancellationToken ct)
    {
        // Seekable temp file — pipe+seek fails with FFmpeg exit 69 on many phone MP4s.
        var videoPath = await tempFiles.Persist(stream, extension: string.Empty, ct);

        var analysis = await FFProbe.AnalyseAsync(videoPath, cancellationToken: ct);
        var duration = analysis.Duration;
        var frameCount = ResolveFrameCount(analysis, duration);
        var timestamps = SampleTimestamps(duration, frameCount);

        var pngBuffers = new MemoryStream[timestamps.Count];
        try
        {
            for (var i = 0; i < timestamps.Count; i++)
            {
                ct.ThrowIfCancellationRequested();
                pngBuffers[i] = await ExtractFramePng(videoPath, timestamps[i], ct);
            }

            var frames = new string[timestamps.Count];
            var parallelOptions = new ParallelOptions
            {
                MaxDegreeOfParallelism = Math.Max(1, Environment.ProcessorCount),
                CancellationToken = ct,
            };

            await Parallel.ForEachAsync(
                Enumerable.Range(0, pngBuffers.Length),
                parallelOptions,
                async (i, token) =>
                {
                    frames[i] = await imageConverter.Convert(pngBuffers[i], options, token);
                });

            return new VideoAsciiResult { Frames = frames };
        }
        finally
        {
            foreach (var png in pngBuffers)
            {
                if (png is not null)
                {
                    await png.DisposeAsync();
                }
            }
        }
    }

    private static async Task<MemoryStream> ExtractFramePng(
        string videoPath,
        TimeSpan captureTime,
        CancellationToken ct)
    {
        var pngBuffer = new MemoryStream();

        await FFMpegArguments
            .FromFileInput(videoPath, verifyExists: true, opts => opts.Seek(captureTime))
            .OutputToPipe(new StreamPipeSink(pngBuffer), opts => opts
                .WithCustomArgument("-map 0:v:0")
                .WithVideoCodec(VideoCodec.Image.Png)
                .WithFrameOutputCount(1)
                .ForceFormat("image2"))
            .CancellableThrough(ct)
            .ProcessAsynchronously();

        pngBuffer.Position = 0;
        return pngBuffer;
    }

    private static int ResolveFrameCount(IMediaAnalysis analysis, TimeSpan duration)
    {
        if (duration <= TimeSpan.Zero)
        {
            return 1;
        }

        var estimated = MaxFrames;
        var stream = analysis.PrimaryVideoStream;
        if (stream is not null)
        {
            var fps = stream.AvgFrameRate > 0 ? stream.AvgFrameRate : stream.FrameRate;
            if (fps > 0)
            {
                estimated = Math.Max(1, (int)Math.Round(duration.TotalSeconds * fps));
            }
        }

        return Math.Min(MaxFrames, estimated);
    }

    /// <summary>
    /// Evenly spaced sample times at segment midpoints (avoids seeking exactly to EOF).
    /// </summary>
    internal static IReadOnlyList<TimeSpan> SampleTimestamps(TimeSpan duration, int count)
    {
        if (count <= 1 || duration <= TimeSpan.Zero)
        {
            return [TimeSpan.Zero];
        }

        var timestamps = new TimeSpan[count];
        for (var i = 0; i < count; i++)
        {
            timestamps[i] = TimeSpan.FromTicks((long)(duration.Ticks * (i + 0.5) / count));
        }

        return timestamps;
    }
}
