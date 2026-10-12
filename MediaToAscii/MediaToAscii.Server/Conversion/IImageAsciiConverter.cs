namespace MediaToAscii.Server.Conversion;

public interface IImageAsciiConverter
{
    Task<string> ConvertAsync(Stream stream, ConvertOptions options, CancellationToken cancellationToken = default);
}
