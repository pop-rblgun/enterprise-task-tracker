namespace TaskTracker.Api.DTOs;

public record RegisterRequestDto(string Email, string Password, string FullName);
public record LoginRequestDto(string Email, string Password);
public record AuthResponseDto(string Token, string FullName, string Email);

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public DateTime? DueDate { get; set; }
    public string? AssigneeId { get; set; }
    public string? JiraKey { get; set; }
}
