using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;

namespace Portfolio.Api.Services;

/// <summary>
/// GitHub Models embeddings REST API (OpenAI SDK uses /v1/embeddings which GitHub does not support).
/// POST https://models.github.ai/inference/embeddings
/// </summary>
public class GithubModelsEmbeddingClient
{
    public const int EmbeddingDimensions = 1536;

    private readonly OpenAiSettings _settings;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GithubModelsEmbeddingClient> _logger;

    public GithubModelsEmbeddingClient(
        IOptions<OpenAiSettings> settings,
        IHttpClientFactory httpClientFactory,
        ILogger<GithubModelsEmbeddingClient> logger)
    {
        _settings = settings.Value;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken = default)
    {
        var batch = await EmbedBatchAsync([text], cancellationToken);
        return batch[0];
    }

    public async Task<List<float[]>> EmbedBatchAsync(
        IReadOnlyList<string> texts,
        CancellationToken cancellationToken = default)
    {
        if (texts.Count == 0)
        {
            return [];
        }

        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new InvalidOperationException(
                "GitHub Models API key missing. Set OpenAI:ApiKey in user secrets or appsettings.");
        }

        var baseUrl = _settings.Endpoint.TrimEnd('/');
        var url = $"{baseUrl}/embeddings";

        var payload = new EmbeddingRequest
        {
            Model = _settings.EmbeddingModelId,
            Input = texts.Count == 1 ? texts[0] : texts
        };

        var client = _httpClientFactory.CreateClient("GithubModels");
        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
        request.Content = JsonContent.Create(payload);

        _logger.LogInformation("Requesting {Count} embeddings from {Url}", texts.Count, url);

        using var response = await client.SendAsync(request, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Embeddings failed {Status}: {Body}", response.StatusCode, body);
            throw new InvalidOperationException(
                $"GitHub Models embeddings failed ({(int)response.StatusCode}): {Truncate(body, 300)}");
        }

        var parsed = System.Text.Json.JsonSerializer.Deserialize<EmbeddingResponse>(body);
        if (parsed?.Data is null || parsed.Data.Count == 0)
        {
            throw new InvalidOperationException("Embeddings response was empty.");
        }

        var ordered = parsed.Data.OrderBy(d => d.Index).Select(d => d.Embedding).ToList();

        if (ordered.Count != texts.Count)
        {
            throw new InvalidOperationException(
                $"Expected {texts.Count} embeddings, got {ordered.Count}.");
        }

        foreach (var vector in ordered)
        {
            if (vector.Length != EmbeddingDimensions)
            {
                throw new InvalidOperationException(
                    $"Embedding dimension {vector.Length} != expected {EmbeddingDimensions}.");
            }
        }

        _logger.LogInformation("Received {Count} embeddings ({Dims} dimensions)", ordered.Count, EmbeddingDimensions);
        return ordered;
    }

    private static string Truncate(string value, int max) =>
        value.Length <= max ? value : value[..max] + "...";

    private sealed class EmbeddingRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("input")]
        public object Input { get; set; } = string.Empty;
    }

    private sealed class EmbeddingResponse
    {
        [JsonPropertyName("data")]
        public List<EmbeddingData>? Data { get; set; }
    }

    private sealed class EmbeddingData
    {
        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("embedding")]
        public float[] Embedding { get; set; } = [];
    }
}
