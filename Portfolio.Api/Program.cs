using Portfolio.Api.Configuration;
using Portfolio.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<OpenAiSettings>(builder.Configuration.GetSection(OpenAiSettings.SectionName));
builder.Services.Configure<QdrantSettings>(builder.Configuration.GetSection(QdrantSettings.SectionName));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(EmailSettings.SectionName));

builder.Services.AddHttpClient("GithubModels", client =>
{
    client.Timeout = TimeSpan.FromSeconds(120);
});

builder.Services.AddSingleton<GithubModelsEmbeddingClient>();
builder.Services.AddSingleton<OpenAiService>();
builder.Services.AddSingleton<QdrantVectorStore>();
builder.Services.AddScoped<RagService>();
builder.Services.AddScoped<ContactEmailService>();

var emailProvider = builder.Configuration["Email:Provider"] ?? "Smtp";
if (emailProvider.Equals("Resend", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton<IContactEmailSender, ResendContactEmailSender>();
    builder.Services.AddHttpClient("Resend");
}
else
{
    builder.Services.AddSingleton<IContactEmailSender, SmtpContactEmailSender>();
}

builder.Services.AddHttpClient();

var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("PortfolioCors", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Log config sources at startup (never log secret values)
var openAiKey = app.Configuration["OpenAI:ApiKey"];
var qdrantHost = app.Configuration["Qdrant:Host"];
var qdrantPort = app.Configuration["Qdrant:Port"];
var collection = app.Configuration["Qdrant:CollectionName"];
app.Logger.LogInformation(
    "Config: OpenAI key {KeyStatus}, Qdrant {Host}:{Port}, collection {Collection}",
    string.IsNullOrWhiteSpace(openAiKey) ? "MISSING" : "set",
    qdrantHost,
    qdrantPort,
    collection);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("PortfolioCors");
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();
