using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;
using Portfolio.Api.Models;
using Qdrant.Client;
using Qdrant.Client.Grpc;

namespace Portfolio.Api.Services;

public class QdrantVectorStore
{
    private readonly QdrantSettings _settings;
    private readonly ILogger<QdrantVectorStore> _logger;
    private QdrantClient? _client;

    public QdrantVectorStore(IOptions<QdrantSettings> settings, ILogger<QdrantVectorStore> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    private QdrantClient GetClient() =>
        _client ??= new QdrantClient(
            host: _settings.Host,
            port: _settings.Port,
            https: _settings.Https);

    public async Task EnsureCollectionAsync(CancellationToken cancellationToken = default)
    {
        var client = GetClient();
        var collections = await client.ListCollectionsAsync(cancellationToken);
        var exists = collections.Any(c => c == _settings.CollectionName);

        if (!exists)
        {
            await CreateCollectionAsync(client, cancellationToken);
        }
    }

    public async Task RecreateCollectionAsync(CancellationToken cancellationToken = default)
    {
        var client = GetClient();
        var collections = await client.ListCollectionsAsync(cancellationToken);

        if (collections.Any(c => c == _settings.CollectionName))
        {
            await client.DeleteCollectionAsync(_settings.CollectionName, cancellationToken: cancellationToken);
            _logger.LogInformation("Deleted collection {Collection}", _settings.CollectionName);
        }

        await CreateCollectionAsync(client, cancellationToken);
    }

    private async Task CreateCollectionAsync(QdrantClient client, CancellationToken cancellationToken)
    {
        await client.CreateCollectionAsync(
            _settings.CollectionName,
            new VectorParams
            {
                Size = GithubModelsEmbeddingClient.EmbeddingDimensions,
                Distance = Distance.Cosine
            },
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Created Qdrant collection {Collection} on {Host}:{Port} (gRPC)",
            _settings.CollectionName,
            _settings.Host,
            _settings.Port);
    }

    public async Task UpsertChunksAsync(
        IReadOnlyList<TextChunk> chunks,
        IReadOnlyList<float[]> vectors,
        CancellationToken cancellationToken = default)
    {
        if (chunks.Count != vectors.Count)
        {
            throw new ArgumentException("Chunk count must match vector count.");
        }

        var client = GetClient();
        var points = new List<PointStruct>();

        for (var i = 0; i < chunks.Count; i++)
        {
            var chunk = chunks[i];
            var vector = vectors[i];

            if (vector.Length != GithubModelsEmbeddingClient.EmbeddingDimensions)
            {
                throw new InvalidOperationException(
                    $"Chunk {chunk.Id}: vector size {vector.Length}, expected {GithubModelsEmbeddingClient.EmbeddingDimensions}.");
            }

            points.Add(new PointStruct
            {
                Id = ChunkToPointId(chunk.Id),
                Vectors = vector,
                Payload =
                {
                    ["chunk_id"] = chunk.Id,
                    ["section"] = chunk.Section,
                    ["text"] = chunk.Text
                }
            });
        }

        _logger.LogInformation("Upserting {Count} points to {Collection}...", points.Count, _settings.CollectionName);
        await client.UpsertAsync(_settings.CollectionName, points, cancellationToken: cancellationToken);
        _logger.LogInformation("Upserted {Count} points into {Collection}", points.Count, _settings.CollectionName);
    }

    public async Task<ulong> GetPointCountAsync(CancellationToken cancellationToken = default)
    {
        var client = GetClient();
        var info = await client.GetCollectionInfoAsync(_settings.CollectionName, cancellationToken);
        return info.PointsCount;
    }

    public async Task<bool> IsReachableAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var client = GetClient();
            await client.ListCollectionsAsync(cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Qdrant not reachable at {Host}:{Port}", _settings.Host, _settings.Port);
            return false;
        }
    }

    public async Task<List<(string Text, string Section, float Score)>> SearchAsync(
        float[] queryVector,
        int limit = 5,
        CancellationToken cancellationToken = default)
    {
        var client = GetClient();
        var results = await client.SearchAsync(
            _settings.CollectionName,
            queryVector,
            limit: (ulong)limit,
            cancellationToken: cancellationToken);

        return results
            .Select(r => (
                Text: r.Payload["text"].StringValue,
                Section: r.Payload["section"].StringValue,
                Score: r.Score))
            .ToList();
    }

    /// <summary>Stable numeric point id from chunk id (Qdrant prefers ulong over random UUID).</summary>
    private static ulong ChunkToPointId(string chunkId)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(chunkId));
        return BitConverter.ToUInt64(hash, 0);
    }
}
