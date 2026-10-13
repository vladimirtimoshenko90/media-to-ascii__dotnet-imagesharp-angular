namespace MediaToAscii.Server.Conversion.Entities;

public sealed record AsciiVideo(
    IReadOnlyList<AsciiFrame> Frames,
    int DurationMs,
    int FrameDelayMs);
