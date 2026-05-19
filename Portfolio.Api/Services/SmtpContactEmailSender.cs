using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Portfolio.Api.Configuration;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public class SmtpContactEmailSender : IContactEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpContactEmailSender> _logger;

    public SmtpContactEmailSender(IOptions<EmailSettings> settings, ILogger<SmtpContactEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<ContactResponse> SendAsync(ContactRequest request, CancellationToken cancellationToken = default)
    {
        var smtp = _settings.Smtp;

        if (string.IsNullOrWhiteSpace(smtp.Username) || string.IsNullOrWhiteSpace(smtp.Password))
        {
            return new ContactResponse(
                false,
                "SMTP is not configured. Set Email__Smtp__Username and Email__Smtp__Password (Gmail app password).");
        }

        if (string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            return new ContactResponse(false, "Email:ToAddress is not configured.");
        }

        var fromAddress = string.IsNullOrWhiteSpace(smtp.FromAddress) ? smtp.Username : smtp.FromAddress;

        try
        {
            var message = BuildMessage(request, fromAddress, smtp.FromName, _settings.ToAddress);

            using var client = new SmtpClient();
            await client.ConnectAsync(smtp.Host, smtp.Port, SecureSocketOptions.StartTls, cancellationToken);
            await client.AuthenticateAsync(smtp.Username, smtp.Password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Contact email sent from {Email} via SMTP", request.Email);
            return new ContactResponse(true, "Message sent successfully. Yashwanth will get back to you soon.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SMTP send failed");
            return new ContactResponse(
                false,
                "Could not send email. Check SMTP credentials (use a Gmail App Password, not your normal password).");
        }
    }

    private static MimeMessage BuildMessage(
        ContactRequest request,
        string fromAddress,
        string fromName,
        string toAddress)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromAddress));
        message.To.Add(MailboxAddress.Parse(toAddress));
        message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
        message.Subject = $"[Portfolio] {request.Subject}";

        var body = $"""
            New message from your portfolio contact form.

            Name: {request.Name}
            Email: {request.Email}
            Subject: {request.Subject}

            Message:
            {request.Message}
            """;

        message.Body = new TextPart("plain") { Text = body };
        return message;
    }
}
