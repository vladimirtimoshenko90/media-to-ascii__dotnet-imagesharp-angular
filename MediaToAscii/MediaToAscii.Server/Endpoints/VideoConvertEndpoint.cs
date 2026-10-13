using MediaToAscii.Server.Conversion.Services;
using MediaToAscii.Server.Endpoints.Dtos;
using MediaToAscii.Server.Endpoints.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace MediaToAscii.Server.Endpoints;

public static class VideoConvertEndpoint
{
    public const string FrameSeparator = "\n\n----\n\n";

    public static IEndpointRouteBuilder MapVideoConvert(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/convert/video", ConvertVideo)
            .DisableAntiforgery()
            .AddAutoValidation<ConvertFormRequest>();
        return endpoints;
    }

    private static async Task<IResult> ConvertVideo(
        [FromForm] ConvertFormRequest form,
        IVideoAsciiConverter converter,
        CancellationToken ct)
    {
        var options = form.ToConvertOptions();
        await using var stream = form.File!.OpenReadStream();
        var result = await converter.Convert(stream, options, ct);
        var body = string.Join(FrameSeparator, result.Frames);
        return Results.Text(body, contentType: "text/plain");
    }
}
