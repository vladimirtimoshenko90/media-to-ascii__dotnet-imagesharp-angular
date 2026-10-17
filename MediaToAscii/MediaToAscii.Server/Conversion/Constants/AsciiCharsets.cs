namespace MediaToAscii.Server.Conversion.Constants;

public enum AsciiCharsetType
{
    Classic,
    Medium,
    Detailed,
    Blocks,
}

public static class AsciiCharsets
{
    public const string Classic = "@%#*+=-:. ";

    public const string Medium = "@&#*%+=~-;:,. ";

    public const string Detailed =
        "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

    public const string Blocks = "█▓▒░ ";
}

public static class AsciiCharsetTypeExtensions
{
    public static string GetGlyphs(this AsciiCharsetType type) => type switch
    {
        AsciiCharsetType.Classic => AsciiCharsets.Classic,
        AsciiCharsetType.Medium => AsciiCharsets.Medium,
        AsciiCharsetType.Detailed => AsciiCharsets.Detailed,
        AsciiCharsetType.Blocks => AsciiCharsets.Blocks,
        _ => throw new ArgumentOutOfRangeException(nameof(type), type, "Unknown ASCII charset type."),
    };
}
