using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskTracker.Api.Data;
using TaskTracker.Api.Services;

namespace TaskTracker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class JiraController : ControllerBase
{
    private readonly IJiraService _jiraService;
    private readonly AppDbContext _context;

    public JiraController(IJiraService jiraService, AppDbContext context)
    {
        _jiraService = jiraService;
        _context = context;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record JiraImportRequest(string Domain, string Email, string ApiToken, string ProjectKey, int LocalProjectId);

    [HttpPost("import")]
    public async Task<IActionResult> Import(JiraImportRequest request)
    {
        var project = await _context.Projects.FindAsync(request.LocalProjectId);
        if (project == null || project.OwnerId != CurrentUserId) return Forbid();

        try
        {
            var importedCount = await _jiraService.ImportTasks(
                request.Domain, 
                request.Email, 
                request.ApiToken, 
                request.ProjectKey, 
                request.LocalProjectId
            );
            return Ok(new { message = $"Successfully imported {importedCount} tasks from Jira." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
