namespace Portfolio.Api.Configuration;

public class OpenAiSettings
{
    public const string SectionName = "OpenAI";

    public string ModelId { get; set; } = "openai/gpt-4.1-mini";
    public string EmbeddingModelId { get; set; } = "openai/text-embedding-3-small";
    public string Endpoint { get; set; } = "https://models.github.ai/inference";
    public string ApiKey { get; set; } = string.Empty;
}
