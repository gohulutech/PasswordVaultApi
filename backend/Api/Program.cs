using Application;
using Domain.Interfaces;
using Infrastructure;
using SQLite;

var builder = WebApplication.CreateBuilder(args);

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
