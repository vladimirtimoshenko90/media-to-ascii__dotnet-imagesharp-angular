using MediaToAscii.Server.Conversion.Services;
using MediaToAscii.Server.Endpoints.Dtos;
using MediaToAscii.Server.Endpoints.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace MediaToAscii.Server.Endpoints;

public static class ImageConvertEndpoint
{
    public static IEndpointRouteBuilder MapImageConvert(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/convert/image", ConvertImage)
            .DisableAntiforgery()
            .AddAutoValidation<ConvertFormRequest>();
        return endpoints;
    }

    private static async Task<IResult> ConvertImage(
        [FromForm] ConvertFormRequest form,
        IImageAsciiConverter converter,
        CancellationToken ct)
    {
        var options = form.ToConvertOptions();
        await using var stream = form.File!.OpenReadStream();
        var frame = await converter.Convert(stream, options, ct);
        return Results.Json(frame);
    }
}
