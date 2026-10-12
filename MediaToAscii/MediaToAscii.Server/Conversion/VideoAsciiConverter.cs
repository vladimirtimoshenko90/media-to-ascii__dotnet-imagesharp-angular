using FFMpegCore;
using FFMpegCore.Enums;
using FFMpegCore.Pipes;

namespace MediaToAscii.Server.Conversion;

public interface IVideoAsciiConverter
{
    Task<VideoAsciiResult> Convert(Stream stream, ConvertOptions options, CancellationToken ct);
}

public sealed class VideoAsciiResult
{
    public IReadOnlyList<string> Frames { get; init; } = [];
}

public sealed class VideoAsciiConverter(IImageAsciiConverter imageConverter) : IVideoAsciiConverter
{
    public const int MaxFrames = 30;

    public async Task<VideoAsciiResult> Convert(Stream stream, ConvertOptions options, CancellationToken ct)
    {
        await using var videoBuffer = new MemoryStream();
        await stream.CopyToAsync(videoBuffer, ct);
        videoBuffer.Position = 0;

        var analysis = await FFProbe.AnalyseAsync(videoBuffer, cancellationToken: ct);
        videoBuffer.Position = 0;

        var duration = analysis.Duration;
        var frameCount = ResolveFrameCount(analysis, duration);
        var timestamps = SampleTimestamps(duration, frameCount);
        var videoStreamIndex = analysis.PrimaryVideoStream?.Index
            ?? analysis.VideoStreams.FirstOrDefault()?.Index
            ?? 0;

        var frames = new List<string>(timestamps.Count);
        for (var i = 0; i < timestamps.Count; i++)
        {
            ct.ThrowIfCancellationRequested();

            await using var pngBuffer = await ExtractFramePng(
                videoBuffer,
                timestamps[i],
                videoStreamIndex,
                ct);
            var ascii = await imageConverter.Convert(pngBuffer, options, ct);
            frames.Add(ascii);
        }

        return new VideoAsciiResult { Frames = frames };
    }

    private static async Task<MemoryStream> ExtractFramePng(
        MemoryStream videoBuffer,
        TimeSpan captureTime,
        int videoStreamIndex,
        CancellationToken ct)
    {
        videoBuffer.Position = 0;
        var pngBuffer = new MemoryStream();

        await FFMpegArguments
            .FromPipeInput(new StreamPipeSource(videoBuffer), opts => opts.Seek(captureTime))
            .OutputToPipe(new StreamPipeSink(pngBuffer), opts => opts
                .SelectStream(videoStreamIndex, 0)
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
