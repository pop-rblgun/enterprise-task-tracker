using Microsoft.AspNetCore.SignalR;

namespace TaskTracker.Api.Hubs
{
    public class TaskHub : Hub
    {
        // Clients can call this method, or the API controller will broadcast.
        // We will primarily broadcast from the Controllers.
        
        public async Task JoinProject(string projectId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, projectId);
        }

        public async Task LeaveProject(string projectId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, projectId);
        }
    }
}
