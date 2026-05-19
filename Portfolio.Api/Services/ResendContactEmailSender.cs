using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

/// <summary>
/// Optional provider: https://resend.com — free tier, reliable deliverability.
/// </summary>
public class ResendContactEmailSender : IContactEmailSender
{
    private readonly EmailSettings _settings;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ResendContactEmailSender> _logger;

    public ResendContactEmailSender(
        IOptions<EmailSettings> settings,
        IHttpClientFactory httpClientFactory,
        ILogger<ResendContactEmailSender> logger)
    {
        _settings = settings.Value;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<ContactResponse> SendAsync(ContactRequest request, CancellationToken cancellationToken = default)
    {
        var resend = _settings.Resend;

        if (string.IsNullOrWhiteSpace(resend.ApiKey) || string.IsNullOrWhiteSpace(resend.FromAddress))
        {
            return new ContactResponse(
                false,
                "Resend is not configured. Set Email__Resend__ApiKey and Email__Resend__FromAddress.");
        }

        if (string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            return new ContactResponse(false, "Email:ToAddress is not configured.");
        }

        var payload = new ResendPayload
        {
            From = resend.FromAddress,
            To = [_settings.ToAddress],
            ReplyTo = request.Email,
            Subject = $"[Portfolio] {request.Subject}",
            Text = $"""
                New message from your portfolio.

                Name: {request.Name}
                Email: {request.Email}

                {request.Message}
                """
        };

        try
        {
            var client = _httpClientFactory.CreateClient("Resend");
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {resend.ApiKey}");

            var response = await client.PostAsJsonAsync(
                "https://api.resend.com/emails",
                payload,
                cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new ContactResponse(true, "Message sent successfully. Yashwanth will get back to you soon.");
            }

            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Resend failed: {Status} {Body}", response.StatusCode, body);
            return new ContactResponse(false, "Failed to send via Resend. Check API key and verified sender domain.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Resend send failed");
            return new ContactResponse(false, "Failed to send email via Resend.");
        }
    }

    private sealed class ResendPayload
    {
        [JsonPropertyName("from")]
        public string From { get; set; } = string.Empty;

        [JsonPropertyName("to")]
        public string[] To { get; set; } = [];

        [JsonPropertyName("reply_to")]
        public string ReplyTo { get; set; } = string.Empty;

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }
}
