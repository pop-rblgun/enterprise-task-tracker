# Enterprise-level Task Tracker

A professional-grade, enterprise-ready Task Management Application. It follows a traditional N-Tier Architecture and showcases a robust integration between a modern frontend Single Page Application (SPA) and an efficient RESTful Backend.

## 🌟 Overview
This project is a high-performance clone of leading enterprise tracking tools (like Jira or Trello), with a specific focus on robust business logic, premium design, and scalable architecture.

* **Frontend**: Angular 17+ with Angular Material.
* **Backend**: ASP.NET Core 8 Web API.
* **Database**: SQLite (managed via Entity Framework Core).
* **Special Feature**: External Jira API Integration to seamlessly import tasks from real Atlassian workspaces.

---

## 🏗️ Architecture

1. **Presentation Layer (Frontend)**: 
   - Utilizes Angular Material for enterprise-grade UI components. 
   - Implements Angular CDK for drag-and-drop operations in the Kanban board.
   - Leverages `RxJS` out of the box for handling async data flows.
   - Contains automatic JWT Interceptors for secure API interactions.

2. **API & Service Layer (Backend)**:
   - Written in C# utilizing the latest standard ASP.NET Core abstractions.
   - Secures endpoints via JWT (JSON Web Tokens) Identity Auth.
   - Adheres to clear DTOs (Data Transfer Objects) patterns to prevent over-fetching.
   - Exposes clean RESTful routes documented fully by Swagger.

3. **Data Access Layer**:
   - Built on Entity Framework (EF) Core for code-first migrations.
   - Ensures correct relation mapping (One-to-Many between Projects and Tasks, Owner bindings).

---

## 🚀 How It Works & How to Use It

The tracking application requires both the **Backend** and the **Frontend** to be running simultaneously.

### 1. Running the Backend API
The backend acts as the single source of truth and database manager.
1. Open up a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Build and run the ASP.NET Core application:
   ```bash
   dotnet run
   ```
3. The API will start (usually on `http://localhost:5031` or `https://localhost:7081`).
   - *Test it by opening: `http://localhost:5031/swagger` to see the endpoints documentation.*

### 2. Running the Frontend SPA
The frontend uses the Angular CLI to serve the interactive web app.
1. Open a **new** separate terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install npm dependencies (if not done yet):
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Navigate your web browser to `http://localhost:4200`.

### 3. Using the App Workflow

1. **Authentication**: When you load the frontend, start by **Registering** a new user account.
2. **Dashboard**: Upon login, you enter the Project Portfolio Dashboard. Click **NEW PROJECT** to create a workspace.
3. **Task Board**: Click on your created project to enter the Kanban board.
   - Click **ADD TASK** to insert tasks manually.
   - **Drag and Drop**: Move tasks freely among *To Do*, *In Progress*, *Review*, and *Done* lanes.
4. **Jira Integration**: Inside the board, click **IMPORT JIRA**. Provide your Atlassian Domain, Account Email, API Token, and a Project Key (e.g., *KAN*) to bulk-import issues correctly mapped into your local database.

---
*Created as a demonstration of strict typing and full-stack software architecture principles.*
