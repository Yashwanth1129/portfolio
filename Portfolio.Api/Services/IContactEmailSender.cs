using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public interface IContactEmailSender
{
    Task<ContactResponse> SendAsync(ContactRequest request, CancellationToken cancellationToken = default);
}
