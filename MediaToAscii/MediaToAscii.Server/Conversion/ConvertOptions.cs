using MediaToAscii.Server.Conversion.Constants;

namespace MediaToAscii.Server.Conversion;

public sealed class ConvertOptions
{
    public int Width { get; set; } = 100;

    public bool Invert { get; set; } = false;

    public AsciiCharsetType Charset { get; set; } = AsciiCharsetType.Classic;
}
