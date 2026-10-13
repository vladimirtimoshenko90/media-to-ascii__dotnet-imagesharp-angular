using MediaToAscii.Server.Conversion.Constants;

namespace MediaToAscii.Server.Endpoints;

public static class ConfigurationEndpoints
{
    public static IEndpointRouteBuilder MapConfigurationEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/config/convert-options", GetConvertOptions);
        return endpoints;
    }

    private static IResult GetConvertOptions()
    {
        var charsets = Enum.GetValues<AsciiCharsetType>()
            .Select(type => new AsciiCharsetOption(type, type.GetGlyphs()))
            .ToArray();

        return Results.Json(charsets);
    }
}

public sealed record AsciiCharsetOption(AsciiCharsetType Id, string Characters);
