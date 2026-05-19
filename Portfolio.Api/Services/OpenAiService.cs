using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using Portfolio.Api.Configuration;
using System.ClientModel;

namespace Portfolio.Api.Services;

public class OpenAiService
{
    private readonly OpenAiSettings _settings;
    private readonly GithubModelsEmbeddingClient _embeddings;
    private readonly ILogger<OpenAiService> _logger;
    private OpenAIClient? _chatClient;

    public OpenAiService(
        IOptions<OpenAiSettings> settings,
        GithubModelsEmbeddingClient embeddings,
        ILogger<OpenAiService> logger)
    {
        _settings = settings.Value;
        _embeddings = embeddings;
        _logger = logger;
    }

    public Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken = default) =>
        _embeddings.EmbedAsync(text, cancellationToken);

    public Task<List<float[]>> EmbedBatchAsync(
        IEnumerable<string> texts,
        CancellationToken cancellationToken = default) =>
        _embeddings.EmbedBatchAsync(texts.ToList(), cancellationToken);

    public async Task<string> ChatAsync(
        string systemPrompt,
        IReadOnlyList<(string Role, string Content)> messages,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new InvalidOperationException(
                "GitHub Models API key missing. Set OpenAI:ApiKey in user secrets or appsettings.");
        }

        var endpoint = _settings.Endpoint.TrimEnd('/');
        var client = _chatClient ??= new OpenAIClient(
            new ApiKeyCredential(_settings.ApiKey),
            new OpenAIClientOptions { Endpoint = new Uri(endpoint) });

        var chat = client.GetChatClient(_settings.ModelId);
        var chatMessages = new List<ChatMessage> { new SystemChatMessage(systemPrompt) };

        foreach (var (role, content) in messages)
        {
            chatMessages.Add(role switch
            {
                "assistant" => new AssistantChatMessage(content),
                _ => new UserChatMessage(content)
            });
        }

        try
        {
            var completion = await chat.CompleteChatAsync(chatMessages, cancellationToken: cancellationToken);
            return completion.Value.Content[0].Text ?? "I could not generate a response.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Chat completion failed");
            throw;
        }
    }
}
