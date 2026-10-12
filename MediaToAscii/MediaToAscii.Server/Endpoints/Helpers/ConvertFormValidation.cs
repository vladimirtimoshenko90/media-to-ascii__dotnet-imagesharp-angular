using MediaToAscii.Server.Conversion;

namespace MediaToAscii.Server.Endpoints.Helpers;

public static class ConvertFormValidation
{
    public const int MinWidth = 20;
    public const int MaxWidth = 300;

    public sealed record ParsedConvertForm(IFormFile File, ConvertOptions Options);

    /// <summary>
    /// Parses multipart form fields <c>file</c>, <c>width</c>, <c>invert</c>, <c>charset</c>.
    /// On failure, <paramref name="error"/> is a plain-text message suitable for HTTP 400.
    /// </summary>
    public static async Task<(ParsedConvertForm? Parsed, string? Error)> TryParse(
        HttpRequest request,
        CancellationToken ct)
    {
        if (!request.HasFormContentType)
        {
            return (null, "Expected multipart form data.");
        }

        var form = await request.ReadFormAsync(ct);
        var file = form.Files.GetFile("file");
        if (file is null || file.Length == 0)
        {
            return (null, "A non-empty file is required.");
        }

        var width = 100;
        var widthRaw = form["width"].ToString();
        if (!string.IsNullOrWhiteSpace(widthRaw))
        {
            if (!int.TryParse(widthRaw, out width))
            {
                return (null, "Width must be an integer.");
            }
        }

        width = Math.Clamp(width, MinWidth, MaxWidth);

        var invert = false;
        var invertRaw = form["invert"].ToString();
        if (!string.IsNullOrWhiteSpace(invertRaw))
        {
            if (!bool.TryParse(invertRaw, out invert))
            {
                return (null, "Invert must be true or false.");
            }
        }

        var charset = form["charset"].ToString();
        if (string.IsNullOrWhiteSpace(charset))
        {
            charset = AsciiCharsets.Classic;
        }

        var parsed = new ParsedConvertForm(
            file,
            new ConvertOptions
            {
                Width = width,
                Invert = invert,
                Charset = charset,
            });
        return (parsed, null);
    }
}
