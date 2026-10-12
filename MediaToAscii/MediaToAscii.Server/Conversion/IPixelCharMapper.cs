namespace MediaToAscii.Server.Conversion;

public interface IPixelCharMapper
{
    char ToChar(byte r, byte g, byte b, ConvertOptions options);
}
