using EncryptionGrpcService;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Service.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5263, o => o.Protocols = HttpProtocols.Http2);

    options.ListenLocalhost(7263, o =>
    {
        o.UseHttps();
        o.Protocols = HttpProtocols.Http2; // required for gRPC
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<EncryptionServiceImpl>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
