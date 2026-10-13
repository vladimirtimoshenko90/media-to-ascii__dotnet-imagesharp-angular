using MediaToAscii.Server.Conversion;
using MediaToAscii.Server.Endpoints;
using MediaToAscii.Server.Common;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCommonServices();
builder.Services.AddConversionServices();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();
app.UseHttpsRedirection();

app.MapImageConvert();
app.MapVideoConvert();

app.MapFallbackToFile("/index.html");

app.Run();
