namespace MediaToAscii.Server.Conversion;

public sealed class VideoAsciiConverter : IVideoAsciiConverter
{
    public Task<VideoAsciiResult> ConvertAsync(
        Stream stream,
        ConvertOptions options,
        CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();
}
