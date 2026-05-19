namespace Portfolio.Api.Configuration;

public class EmailSettings
{
    public const string SectionName = "Email";

    /// <summary>Smtp or Resend</summary>
    public string Provider { get; set; } = "Smtp";

    public string ToAddress { get; set; } = string.Empty;

    public SmtpSettings Smtp { get; set; } = new();
    public ResendSettings Resend { get; set; } = new();
}

public class SmtpSettings
{
    public string Host { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = "Portfolio Contact";
}

public class ResendSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string FromAddress { get; set; } = string.Empty;
}
