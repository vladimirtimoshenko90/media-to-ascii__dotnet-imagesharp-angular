using System.Text;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace MediaToAscii.Server.Conversion;

public interface IImageAsciiConverter
{
    Task<string> Convert(Stream stream, ConvertOptions options, CancellationToken ct);
}

public sealed class ImageAsciiConverter(IPixelCharMapper mapper) : IImageAsciiConverter
{
    public async Task<string> Convert(Stream stream, ConvertOptions options, CancellationToken ct)
    {
        using var image = await Image.LoadAsync<Rgba32>(stream, ct);

        var width = Math.Max(1, options.Width);
        // Monospace glyphs are roughly twice as tall as wide — halve height to keep aspect.
        var height = (int)Math.Round(width * (image.Height / (double)image.Width) * 0.5);
        height = Math.Max(1, height);

        image.Mutate(ctx => ctx.Resize(width, height));

        var sb = new StringBuilder(height * (width + Environment.NewLine.Length));
        image.ProcessPixelRows(accessor =>
        {
            for (var y = 0; y < accessor.Height; y++)
            {
                var row = accessor.GetRowSpan(y);
                for (var x = 0; x < row.Length; x++)
                {
                    ref readonly var pixel = ref row[x];
                    sb.Append(mapper.ToChar(pixel.R, pixel.G, pixel.B, options));
                }

                if (y < accessor.Height - 1)
                {
                    sb.AppendLine();
                }
            }
        });

        return sb.ToString();
    }
}
