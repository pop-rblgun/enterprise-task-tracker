using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskTracker.Api.Data;
using TaskTracker.Api.DTOs;
using TaskTracker.Api.Models;
using Microsoft.AspNetCore.SignalR;
using TaskTracker.Api.Hubs;

namespace TaskTracker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<TaskHub> _hubContext;

    public TasksController(AppDbContext context, IHubContext<TaskHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByProject(int projectId)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.OwnerId != CurrentUserId) return Forbid();

        var tasks = await _context.Tasks
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TaskDto { Id = t.Id, Title = t.Title, Description = t.Description, Status = t.Status.ToString(), Priority = t.Priority.ToString(), ProjectId = t.ProjectId, DueDate = t.DueDate, AssigneeId = t.AssigneeId, JiraKey = t.JiraKey })
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == CurrentUserId);

        if (task == null) return NotFound();
        return new TaskDto { Id = task.Id, Title = task.Title, Description = task.Description, Status = task.Status.ToString(), Priority = task.Priority.ToString(), ProjectId = task.ProjectId, DueDate = task.DueDate, AssigneeId = task.AssigneeId, JiraKey = task.JiraKey };
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(TaskDto taskDto)
    {
        var project = await _context.Projects.FindAsync(taskDto.ProjectId);
        if (project == null || project.OwnerId != CurrentUserId) return Forbid();

        var task = new TaskItem
        {
            Title = taskDto.Title,
            Description = taskDto.Description,
            Status = Enum.Parse<Models.TaskStatus>(taskDto.Status, true),
            Priority = Enum.Parse<TaskPriority>(taskDto.Priority, true),
            ProjectId = taskDto.ProjectId,
            DueDate = taskDto.DueDate,
            AssigneeId = taskDto.AssigneeId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var createdDto = new TaskDto { Id = task.Id, Title = task.Title, Description = task.Description, Status = task.Status.ToString(), Priority = task.Priority.ToString(), ProjectId = task.ProjectId, DueDate = task.DueDate, AssigneeId = task.AssigneeId, JiraKey = task.JiraKey };
        
        // Notify clients in the project group
        await _hubContext.Clients.Group(taskDto.ProjectId.ToString()).SendAsync("TaskCreated", createdDto);

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, createdDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskDto taskDto)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == CurrentUserId);

        if (task == null) return NotFound();

        task.Title = taskDto.Title;
        task.Description = taskDto.Description;
        task.Status = Enum.Parse<Models.TaskStatus>(taskDto.Status, true);
        task.Priority = Enum.Parse<TaskPriority>(taskDto.Priority, true);
        task.DueDate = taskDto.DueDate;
        task.AssigneeId = taskDto.AssigneeId;

        await _context.SaveChangesAsync();
        
        var updatedDto = new TaskDto { Id = task.Id, Title = task.Title, Description = task.Description, Status = task.Status.ToString(), Priority = task.Priority.ToString(), ProjectId = task.ProjectId, DueDate = task.DueDate, AssigneeId = task.AssigneeId, JiraKey = task.JiraKey };
        
        // Notify clients in the project group
        await _hubContext.Clients.Group(task.ProjectId.ToString()).SendAsync("TaskUpdated", updatedDto);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == CurrentUserId);

        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        
        // Notify clients to remove the task
        await _hubContext.Clients.Group(task.ProjectId.ToString()).SendAsync("TaskDeleted", id);
        
        return NoContent();
    }
}
