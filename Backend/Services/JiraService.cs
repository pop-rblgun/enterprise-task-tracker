using System.Net.Http.Headers;
using System.Text.Json;
using TaskTracker.Api.Data;
using TaskTracker.Api.Models;

namespace TaskTracker.Api.Services;

public interface IJiraService
{
    Task<int> ImportTasks(string domain, string email, string apiToken, string projectKey, int localProjectId);
}

public class JiraService : IJiraService
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _context;

    public JiraService(HttpClient httpClient, AppDbContext context)
    {
        _httpClient = httpClient;
        _context = context;
    }

    public async Task<int> ImportTasks(string domain, string email, string apiToken, string projectKey, int localProjectId)
    {
        var authString = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{email}:{apiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authString);

        var url = $"https://{domain}.atlassian.net/rest/api/3/search?jql=project={projectKey}";
        var response = await _httpClient.GetAsync(url);
        
        if (!response.IsSuccessStatusCode)
            throw new Exception($"Failed to fetch from Jira: {response.ReasonPhrase}");

        var content = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        var issues = doc.RootElement.GetProperty("issues");

        int count = 0;
        foreach (var issue in issues.EnumerateArray())
        {
            var fields = issue.GetProperty("fields");
            var key = issue.GetProperty("key").GetString();
            var summary = fields.GetProperty("summary").GetString();
            var description = fields.TryGetProperty("description", out var descProp) && descProp.ValueKind != JsonValueKind.Null 
                ? "Imported from Jira" // Jira description is complex ADF format, simplified for demo
                : "";

            // Check if already exists
            if (await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.AnyAsync(_context.Tasks, t => t.JiraKey == key && t.ProjectId == localProjectId))
                continue;

            var task = new TaskItem
            {
                Title = summary ?? "No Title",
                Description = description,
                Status = Models.TaskStatus.Todo,
                Priority = TaskPriority.Medium,
                ProjectId = localProjectId,
                JiraKey = key,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            count++;
        }

        await _context.SaveChangesAsync();
        return count;
    }
}
