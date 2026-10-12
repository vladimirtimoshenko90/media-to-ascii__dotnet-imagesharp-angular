using MediaToAscii.Server.Conversion;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddConversionServices();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();
app.UseHttpsRedirection();

app.MapFallbackToFile("/index.html");

app.Run();
