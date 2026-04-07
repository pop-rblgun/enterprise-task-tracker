# System Analysis: API Specification

This document provides a technical overview of the RESTful API endpoints for integration and frontend development.

## Authentication
The API uses **JWT (JSON Web Tokens)** for secure communication. All requests (except login/register) must include the `Authorization: Bearer <token>` header.

## Base URL
`https://api-tasktracker.enterprise.com/api/`

## Resources

### 1. Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects owned by the user. |
| POST | `/projects` | Create a new project. |
| GET | `/projects/{id}` | Get detailed project info. |

### 2. Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/project/{projectId}` | Get all tasks for a specific project. |
| POST | `/tasks` | Create a new task. |
| PUT | `/tasks/{id}` | Update task status or details. |
| DELETE| `/tasks/{id}` | Remove a task. |

## Data Transfer Objects (DTOs)

### TaskDto
```json
{
  "id": 1,
  "title": "Implement Auth",
  "description": "Add JWT support",
  "status": "InProgress",
  "priority": "High",
  "projectId": 123,
  "dueDate": "2024-12-31T23:59:59Z",
  "assigneeId": "user-guid",
  "jiraKey": "PROJ-1"
}
```

## Performance & Scalability
*   **Caching**: Redis is used for `GET /projects` to reduce DB load.
*   **Rate Limiting**: 100 requests per minute per IP.
*   **Pagination**: All `Listing` endpoints support `page` and `pageSize` parameters.
