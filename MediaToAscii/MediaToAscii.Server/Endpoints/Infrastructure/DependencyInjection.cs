using System.Text.Json;
using System.Text.Json.Serialization;
using FluentValidation;

namespace MediaToAscii.Server.Endpoints.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddEndpointValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(ValidationFilter<>).Assembly);
        return services;
    }

    public static IServiceCollection AddEndpointJson(this IServiceCollection services)
    {
        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(
                new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        });
        return services;
    }
}

