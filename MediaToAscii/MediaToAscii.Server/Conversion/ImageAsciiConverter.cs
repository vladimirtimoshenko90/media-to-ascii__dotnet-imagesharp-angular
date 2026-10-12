using System.Text;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace MediaToAscii.Server.Conversion;

public sealed class ImageAsciiConverter : IImageAsciiConverter
{
    private readonly IPixelCharMapper _mapper;

    public ImageAsciiConverter(IPixelCharMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task<string> ConvertAsync(
        Stream stream,
        ConvertOptions options,
        CancellationToken cancellationToken = default)
    {
        using var image = await Image.LoadAsync<Rgba32>(stream, cancellationToken);

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
                    sb.Append(_mapper.ToChar(pixel.R, pixel.G, pixel.B, options));
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
