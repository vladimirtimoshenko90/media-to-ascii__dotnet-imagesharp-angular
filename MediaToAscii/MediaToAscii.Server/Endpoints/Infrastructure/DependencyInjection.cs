using FluentValidation;

namespace MediaToAscii.Server.Endpoints.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddEndpointValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(ValidationFilter<>).Assembly);
        return services;
    }
}
