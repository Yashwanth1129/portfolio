using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Services;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RagController : ControllerBase
{
    private readonly RagService _ragService;
    private readonly ILogger<RagController> _logger;

    public RagController(RagService ragService, ILogger<RagController> logger)
    {
        _ragService = ragService;
        _logger = logger;
    }

    [HttpGet("status")]
    public async Task<ActionResult> Status(CancellationToken cancellationToken)
    {
        var status = await _ragService.GetStatusAsync(cancellationToken);
        return Ok(status);
    }

    [HttpPost("index")]
    public async Task<ActionResult> Index([FromQuery] bool recreate = false, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _ragService.IndexPortfolioAsync(recreate, cancellationToken);
            return Ok(new
            {
                message = $"Indexed {result.ChunkCount} chunks for {result.ProfileName}. Qdrant has {result.PointsInCollection} points.",
                result.ChunkCount,
                result.ProfileName,
                result.PointsInCollection
            });
        }
        catch (OperationCanceledException)
        {
            return StatusCode(504, new { error = "Indexing timed out after 3 minutes. Check GitHub API key and Qdrant." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Indexing failed");
            return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
        }
    }
}
