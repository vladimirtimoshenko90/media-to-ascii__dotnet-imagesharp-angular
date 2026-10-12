namespace MediaToAscii.Server.Conversion;

public static class DependencyInjection
{
    public static IServiceCollection AddConversionServices(this IServiceCollection services)
    {
        services.AddSingleton<IPixelCharMapper, PixelCharMapper>();
        services.AddSingleton<IImageAsciiConverter, ImageAsciiConverter>();
        services.AddSingleton<IVideoAsciiConverter, VideoAsciiConverter>();
        return services;
    }
}
