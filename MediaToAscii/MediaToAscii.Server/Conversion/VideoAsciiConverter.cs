using FFMpegCore;
using FFMpegCore.Enums;
using FFMpegCore.Pipes;

namespace MediaToAscii.Server.Conversion;

public sealed class VideoAsciiConverter : IVideoAsciiConverter
{
    public const int MaxFrames = 30;

    private readonly IImageAsciiConverter _imageConverter;

    public VideoAsciiConverter(IImageAsciiConverter imageConverter)
    {
        _imageConverter = imageConverter;
    }

    public async Task<VideoAsciiResult> ConvertAsync(
        Stream stream,
        ConvertOptions options,
        CancellationToken cancellationToken = default)
    {
        await using var videoBuffer = new MemoryStream();
        await stream.CopyToAsync(videoBuffer, cancellationToken);
        videoBuffer.Position = 0;

        var analysis = await FFProbe.AnalyseAsync(videoBuffer, cancellationToken: cancellationToken);
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
            cancellationToken.ThrowIfCancellationRequested();

            await using var pngBuffer = await ExtractFramePngAsync(
                videoBuffer,
                timestamps[i],
                videoStreamIndex,
                cancellationToken);
            var ascii = await _imageConverter.ConvertAsync(pngBuffer, options, cancellationToken);
            frames.Add(ascii);
        }

        return new VideoAsciiResult { Frames = frames };
    }

    private static async Task<MemoryStream> ExtractFramePngAsync(
        MemoryStream videoBuffer,
        TimeSpan captureTime,
        int videoStreamIndex,
        CancellationToken cancellationToken)
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
            .CancellableThrough(cancellationToken)
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
