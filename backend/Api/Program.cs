using Api;
using Application;
using Domain.Interfaces;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;
using SQLite;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors((options) =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});

string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "db.db3");

builder.Services.AddSingleton<SQLiteAsyncConnection>(sp =>
{
    var conn = new SQLiteAsyncConnection(dbPath);
    DatabaseInitializer.InitializeAsync(conn).Wait();
    return conn;
});

builder.Services.AddSingleton<IPasswordEntryRepository, PasswordEntryRepository>();
builder.Services.AddScoped<IPasswordEntryService, PasswordEntryService>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var fields = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                x => ApiBehaviorMethods.ToCamelCase(x.Key),
                x => x.Value?.Errors.Select(ApiBehaviorMethods.MapValidationError).ToArray()
            );

        var response = new
        {
            error = new
            {
                code = "VALIDATION_FAILED",
                fields
            }
        };

        return new BadRequestObjectResult(response);
    };
});

var app = builder.Build();

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

