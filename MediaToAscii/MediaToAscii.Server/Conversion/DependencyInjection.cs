using MediaToAscii.Server.Conversion.Services;

namespace MediaToAscii.Server.Conversion;

public static class DependencyInjection
{
    public static IServiceCollection AddConversionServices(this IServiceCollection services)
    {
        services.AddScoped<IPixelCharMapper, PixelCharMapper>();
        services.AddScoped<IImageAsciiConverter, ImageAsciiConverter>();
        services.AddScoped<IVideoAsciiConverter, VideoAsciiConverter>();
        return services;
    }
}
