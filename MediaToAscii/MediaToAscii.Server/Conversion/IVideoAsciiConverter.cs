namespace MediaToAscii.Server.Conversion;

public interface IVideoAsciiConverter
{
    Task<VideoAsciiResult> ConvertAsync(
        Stream stream,
        ConvertOptions options,
        CancellationToken cancellationToken = default);
}
