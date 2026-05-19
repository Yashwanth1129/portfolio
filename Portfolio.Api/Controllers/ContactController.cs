using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;
using Portfolio.Api.Services;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ContactEmailService _contactEmailService;

    public ContactController(ContactEmailService contactEmailService)
    {
        _contactEmailService = contactEmailService;
    }

    [HttpPost]
    public async Task<ActionResult<ContactResponse>> Post(
        [FromBody] ContactRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Subject) ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new ContactResponse(false, "All fields are required."));
        }

        if (!request.Email.Contains('@'))
        {
            return BadRequest(new ContactResponse(false, "Invalid email address."));
        }

        var result = await _contactEmailService.SendAsync(request, cancellationToken);
        return result.Success ? Ok(result) : StatusCode(500, result);
    }
}
