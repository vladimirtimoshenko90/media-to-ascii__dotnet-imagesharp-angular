namespace MediaToAscii.Server.Conversion;

public static class AsciiCharsets
{
    public const string Classic = "@%#*+=-:. ";

    public const string Detailed =
        "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

    public const string Blocks = "█▓▒░ ";
}

public sealed class ConvertOptions
{
    public int Width { get; set; } = 100;

    public bool Invert { get; set; } = false;

    public string Charset { get; set; } = AsciiCharsets.Classic;
}
