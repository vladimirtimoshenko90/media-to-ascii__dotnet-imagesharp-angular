namespace MediaToAscii.Server.Conversion;

public interface IPixelCharMapper
{
    char ToChar(byte r, byte g, byte b, ConvertOptions options);
}

public sealed class PixelCharMapper : IPixelCharMapper
{
    public char ToChar(byte r, byte g, byte b, ConvertOptions options)
    {
        // Rec. 601 luma: Y = 0.299R + 0.587G + 0.114B
        var luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        var normalized = luminance / 255.0;

        if (options.Invert)
        {
            normalized = 1.0 - normalized;
        }

        var charset = string.IsNullOrEmpty(options.Charset)
            ? AsciiCharsets.Classic
            : options.Charset;

        var index = (int)Math.Round(normalized * (charset.Length - 1));
        index = Math.Clamp(index, 0, charset.Length - 1);
        return charset[index];
    }
}
