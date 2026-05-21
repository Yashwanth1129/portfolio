using System.Text.Json;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public class RagService
{
    private readonly OpenAiService _openAi;
    private readonly QdrantVectorStore _vectorStore;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<RagService> _logger;

    public RagService(
        OpenAiService openAi,
        QdrantVectorStore vectorStore,
        IWebHostEnvironment environment,
        ILogger<RagService> logger)
    {
        _openAi = openAi;
        _vectorStore = vectorStore;
        _environment = environment;
        _logger = logger;
    }

    public async Task<RagStatus> GetStatusAsync(CancellationToken cancellationToken = default)
    {
        var qdrantOk = await _vectorStore.IsReachableAsync(cancellationToken);
        ulong pointCount = 0;

        if (qdrantOk)
        {
            try
            {
                pointCount = await _vectorStore.GetPointCountAsync(cancellationToken);
            }
            catch
            {
                // collection may not exist yet
            }
        }

        var embeddingOk = false;
        string? embeddingError = null;

        try
        {
            await _openAi.EmbedAsync("connection test", cancellationToken);
            embeddingOk = true;
        }
        catch (Exception ex)
        {
            embeddingError = ex.Message;
        }

        return new RagStatus(qdrantOk, pointCount, embeddingOk, embeddingError);
    }

    public async Task<IndexResult> IndexPortfolioAsync(bool recreate, CancellationToken cancellationToken = default)
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(TimeSpan.FromMinutes(3));

        var dataPath = Path.Combine(_environment.ContentRootPath, "Data", "portfolioData.json");
        if (!File.Exists(dataPath))
        {
            throw new FileNotFoundException("Portfolio data file not found.", dataPath);
        }

        if (!await _vectorStore.IsReachableAsync(timeout.Token))
        {
            throw new InvalidOperationException(
                "Cannot reach Qdrant. Start it with: docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant " +
                "and set Qdrant:Host=localhost, Qdrant:Port=6334 in appsettings.");
        }

        var json = await File.ReadAllTextAsync(dataPath, timeout.Token);
        var data = JsonSerializer.Deserialize<PortfolioData>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? throw new InvalidOperationException("Failed to parse portfolio data.");

        var chunks = PortfolioChunker.Chunk(data);
        _logger.LogInformation("Indexing {Count} portfolio chunks...", chunks.Count);

        if (recreate)
        {
            await _vectorStore.RecreateCollectionAsync(timeout.Token);
        }
        else
        {
            await _vectorStore.EnsureCollectionAsync(timeout.Token);
        }

        _logger.LogInformation("Generating embeddings via GitHub Models...");
        var vectors = await _openAi.EmbedBatchAsync(chunks.Select(c => c.Text), timeout.Token);

        _logger.LogInformation("Storing vectors in Qdrant...");
        await _vectorStore.UpsertChunksAsync(chunks, vectors, timeout.Token);

        var pointCount = await _vectorStore.GetPointCountAsync(timeout.Token);
        _logger.LogInformation("Index complete. Collection has {Count} points.", pointCount);

        return new IndexResult(chunks.Count, data.Profile.Name, pointCount);
    }

    public async Task<ChatResponse> AskAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        var queryVector = await _openAi.EmbedAsync(request.Message, cancellationToken);
        var hits = await _vectorStore.SearchAsync(queryVector, limit: 5, cancellationToken);

        var context = hits.Count > 0
            ? string.Join("\n\n---\n\n", hits.Select(h => h.Text))
            : "No relevant context found in the knowledge base.";

        var systemPrompt = $"""
            You are a helpful assistant on Yashwanth Anantha's portfolio website.
            Answer questions about his background, experience, education, certifications, projects, and skills using ONLY the context below.
            For certification questions, list Microsoft Azure credentials (e.g. AZ-900 Azure Fundamentals, AZ-204 Azure Developer Associate) when present in context.
            If the answer is not in the context, say you don't have that information and suggest they use the contact form or email yashwanthanantha99@gmail.com.
            Be concise, professional, and friendly. Recruiters may ask about hiring — encourage them to send a message via the chat contact tab or the contact section.
            Do not invent facts, dates, or companies.

            CONTEXT:
            {context}
            """;

        var messages = new List<(string Role, string Content)>();

        if (request.History is not null)
        {
            foreach (var msg in request.History.TakeLast(6))
            {
                var role = msg.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user";
                messages.Add((role, msg.Content));
            }
        }

        messages.Add(("user", request.Message));

        var reply = await _openAi.ChatAsync(systemPrompt, messages, cancellationToken);
        var sources = hits.Select(h => h.Section).Distinct().ToList();

        return new ChatResponse(reply, sources);
    }
}

public record RagStatus(bool QdrantReachable, ulong PointCount, bool EmbeddingsReachable, string? EmbeddingError);
public record IndexResult(int ChunkCount, string ProfileName, ulong PointsInCollection);
