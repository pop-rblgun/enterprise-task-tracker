using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Api.Models;

public enum TaskStatus
{
    Todo,
    InProgress,
    Review,
    Done
}

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Critical
}

public class User : Microsoft.AspNetCore.Identity.IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Project
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public string OwnerId { get; set; } = string.Empty;
    public User? Owner { get; set; }
    
    public List<TaskItem> Tasks { get; set; } = new();
}

public class TaskItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
    
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
    
    public string? AssigneeId { get; set; }
    public User? Assignee { get; set; }
    
    // For Jira integration
    public string? JiraKey { get; set; }
}
