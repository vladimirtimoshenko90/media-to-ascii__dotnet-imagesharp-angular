using FluentValidation;

namespace MediaToAscii.Server.Endpoints.Infrastructure;

public sealed class ValidationFilter<TRequest> : IEndpointFilter where TRequest : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var validator = context.HttpContext.RequestServices.GetService<IValidator<TRequest>>();
        if (validator is null)
        {
            return await next(context);
        }

        var model = context.Arguments.OfType<TRequest>().FirstOrDefault();
        if (model is null)
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                [string.Empty] = ["Request is required."],
            });
        }

        var result = await validator.ValidateAsync(model, context.HttpContext.RequestAborted);
        if (!result.IsValid)
        {
            return Results.ValidationProblem(result.ToDictionary());
        }

        return await next(context);
    }
}

public static class ValidationFilterExtensions
{
    public static RouteHandlerBuilder AddAutoValidation<TRequest>(this RouteHandlerBuilder builder)
        where TRequest : class
        => builder.AddEndpointFilter<ValidationFilter<TRequest>>();
}
