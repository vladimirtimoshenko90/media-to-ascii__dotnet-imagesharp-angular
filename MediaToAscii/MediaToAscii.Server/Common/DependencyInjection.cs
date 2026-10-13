namespace MediaToAscii.Server.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddCommonServices(this IServiceCollection services)
    {
        services.AddScoped<ITempFileUtility, TempFileUtility>();
        return services;
    }
}
