using MediaToAscii.Server.Conversion;

namespace MediaToAscii.Server.Endpoints;

public static class ImageConvertEndpoint
{
    public static IEndpointRouteBuilder MapImageConvert(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/convert/image", ConvertImage);
        return endpoints;
    }

    private static async Task<IResult> ConvertImage(
        HttpRequest request,
        IImageAsciiConverter converter,
        CancellationToken ct)
    {
        var (parsed, error) = await ConvertFormValidation.TryParse(request, ct);
        if (error is not null)
        {
            return Results.Text(error, contentType: "text/plain", statusCode: StatusCodes.Status400BadRequest);
        }

        await using var stream = parsed!.File.OpenReadStream();
        var ascii = await converter.Convert(stream, parsed.Options, ct);
        return Results.Text(ascii, contentType: "text/plain");
    }
}
