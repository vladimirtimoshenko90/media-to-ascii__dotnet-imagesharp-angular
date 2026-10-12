namespace MediaToAscii.Server.Conversion;

public sealed class PixelCharMapper : IPixelCharMapper
{
    public char ToChar(byte r, byte g, byte b, ConvertOptions options) =>
        throw new NotImplementedException();
}
