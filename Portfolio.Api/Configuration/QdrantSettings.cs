namespace Portfolio.Api.Configuration;

public class QdrantSettings
{
    public const string SectionName = "Qdrant";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 6334;
    public bool Https { get; set; }
    public string CollectionName { get; set; } = "portfolio";
}
