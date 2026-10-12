namespace MediaToAscii.Server.Conversion;

public sealed class ImageAsciiConverter : IImageAsciiConverter
{
    public Task<string> ConvertAsync(Stream stream, ConvertOptions options, CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();
}
