using MediaToAscii.Server.Conversion;

namespace MediaToAscii.Server.Endpoints;

public static class VideoConvertEndpoint
{
    public const string FrameSeparator = "\n\n----\n\n";

    public static IEndpointRouteBuilder MapVideoConvert(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/convert/video", ConvertVideo);
        return endpoints;
    }

    private static async Task<IResult> ConvertVideo(
        HttpRequest request,
        IVideoAsciiConverter converter,
        CancellationToken ct)
    {
        var (parsed, error) = await ConvertFormValidation.TryParse(request, ct);
        if (error is not null)
        {
            return Results.Text(error, contentType: "text/plain", statusCode: StatusCodes.Status400BadRequest);
        }

        await using var stream = parsed!.File.OpenReadStream();
        var result = await converter.Convert(stream, parsed.Options, ct);
        var body = string.Join(FrameSeparator, result.Frames);
        return Results.Text(body, contentType: "text/plain");
    }
}
