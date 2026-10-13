using FluentValidation;
using MediaToAscii.Server.Conversion;
using MediaToAscii.Server.Conversion.Constants;

namespace MediaToAscii.Server.Endpoints.Dtos;

public sealed class ConvertFormRequest
{
    public IFormFile? File { get; set; }
    public int? Width { get; set; }
    public bool? Invert { get; set; }
    public AsciiCharsetType? Charset { get; set; }

    public ConvertOptions ToConvertOptions() => new()
    {
        Width = Width!.Value,
        Invert = Invert!.Value,
        Charset = Charset!.Value,
    };
}

public sealed class ConvertFormRequestValidator : AbstractValidator<ConvertFormRequest>
{
    public const int MinWidth = 20;
    public const int MaxWidth = 300;

    public ConvertFormRequestValidator()
    {
        RuleFor(x => x.File)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("A non-empty file is required.")
            .Must(file => file!.Length > 0)
            .WithMessage("A non-empty file is required.");

        RuleFor(x => x.Width)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage($"Width must be an integer between {MinWidth} and {MaxWidth}.")
            .InclusiveBetween(MinWidth, MaxWidth)
            .WithMessage($"Width must be an integer between {MinWidth} and {MaxWidth}.");

        RuleFor(x => x.Invert)
            .NotNull()
            .WithMessage("Invert must be true or false.");

        RuleFor(x => x.Charset)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("Charset must be one of: classic, detailed, blocks.")
            .IsInEnum()
            .WithMessage("Charset must be one of: classic, detailed, blocks.");
    }
}
