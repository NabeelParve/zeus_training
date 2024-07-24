using MyApp.Contexts;
using Microsoft.EntityFrameworkCore;
using MyApp.Services.UploadService;
using MyApp.Services.UserService;
using MyApp.Interfaces.Upload;
using MyApp.Interfaces.UserInterface;
using MySqlConnector;
using MyApp.Models;
using MyApp.Interfaces.Queue;
using MyApp.Queue;
using Polly;
using Log4NetSample.LogUtility;

var builder = WebApplication.CreateBuilder(args);
string? ConnectionString = builder.Configuration.GetConnectionString("Default");
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
// builder.Logging.ClearProviders();
// builder.Logging.AddConsole();
builder.Services.AddDbContext<MyAppContext>(opt => opt.UseMySql(ConnectionString , ServerVersion.AutoDetect(ConnectionString)));
builder.Services.Configure<MongoSetting>(
    builder.Configuration.GetSection("MongoSetting"));
builder.Services.AddMySqlDataSource(ConnectionString!);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IQueueService, QueueService>();
builder.Services.AddHttpClient<IUserInterface, UserService>().AddTransientHttpErrorPolicy(policy => policy.WaitAndRetryAsync(3, _ => TimeSpan.FromSeconds(2)))
.AddTransientHttpErrorPolicy(policy => policy.CircuitBreakerAsync(5, TimeSpan.FromSeconds(5)));
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<Logger>();
builder.Logging.AddLog4Net();

var app = builder.Build();
app.UseCors(builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
