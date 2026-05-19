using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public class ContactEmailService
{
    private readonly IContactEmailSender _sender;
    private readonly EmailSettings _settings;
    private readonly ILogger<ContactEmailService> _logger;

    public ContactEmailService(
        IContactEmailSender sender,
        IOptions<EmailSettings> settings,
        ILogger<ContactEmailService> logger)
    {
        _sender = sender;
        _settings = settings.Value;
        _logger = logger;
    }

    public Task<ContactResponse> SendAsync(ContactRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            _logger.LogWarning("Email:ToAddress is missing");
            return Task.FromResult(new ContactResponse(false, "Recipient email is not configured on the server."));
        }

        return _sender.SendAsync(request, cancellationToken);
    }
}
