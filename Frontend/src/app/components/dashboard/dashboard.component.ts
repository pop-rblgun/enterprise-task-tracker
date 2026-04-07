import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/app.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="dashboard-layout">
      <div class="dashboard-main">
        <div class="header">
          <div>
            <h1 class="gradient-text">Project Portfolio</h1>
            <p class="subtitle">Manage everything in one central hub.</p>
          </div>
          <div class="actions">
            <button mat-flat-button class="btn-create" (click)="createProject()">
              <mat-icon>add</mat-icon> NEW PROJECT
            </button>
          </div>
        </div>

        <div class="project-grid">
          <mat-card *ngFor="let p of projects()" class="project-card" (click)="goToBoard(p.id)">
            <mat-card-header>
              <div mat-card-avatar class="project-avatar"><mat-icon>folder</mat-icon></div>
              <mat-card-title>{{p.name}}</mat-card-title>
              <mat-card-subtitle>Created {{p.createdAt | date:'mediumDate'}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{p.description}}</p>
            </mat-card-content>
            <mat-card-actions align="end" class="card-actions">
              <button mat-icon-button class="btn-delete" (click)="$event.stopPropagation(); deleteProject(p.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div *ngIf="projects().length === 0" class="empty-state">
          <mat-icon class="huge-icon">folder_open</mat-icon>
          <p>No projects yet. Create one to get started.</p>
        </div>
      </div>

      <!-- Lightweight Content Explorer -->
      <aside class="content-explorer">
        <div class="explorer-header">
          <h3>Activity Feed</h3>
          <mat-icon>public</mat-icon>
        </div>
        <div class="explorer-content">
          <div class="feed-item" *ngFor="let item of feedItems()">
            <div class="feed-icon"><mat-icon>commit</mat-icon></div>
            <div class="feed-text">
              <strong>{{item.author}}</strong> {{item.action}}
              <span class="time">{{item.time}}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      min-height: 100vh;
      background: var(--bg-light);
      color: #1d1d1f;
    }
    .dashboard-main {
      padding: 40px 48px;
      overflow-y: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
    }
    .gradient-text {
      color: #1d1d1f; /* Removed gradient for clear dark text */
      font-size: 2.75rem;
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.04em;
    }
    .subtitle { color: #86868b; font-size: 1.2rem; margin-top: 8px; font-weight: 500; }
    .btn-create {
      background: var(--primary-color);
      color: white;
      border-radius: 12px;
      padding: 24px 24px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 113, 227, 0.3);
      transition: all 0.3s cubic-bezier(0.1, 0.7, 0.1, 1);
    }
    .btn-create:hover {
      box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4);
      transform: translateY(-1px);
    }
    
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .project-card {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      color: #1d1d1f;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.1, 0.7, 0.1, 1);
    }
    .project-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
      border-color: rgba(0, 113, 227, 0.2);
    }
    ::ng-deep .project-card mat-card-title { color: #1d1d1f; font-weight: 600; font-size: 1.3rem; letter-spacing: -0.02em; }
    ::ng-deep .project-card mat-card-subtitle { color: #86868b; font-weight: 500; }
    ::ng-deep .project-card p { color: #5e5e60; font-size: 1rem; line-height: 1.5; }
    
    .project-avatar {
      background: rgba(0, 113, 227, 0.1);
      color: #0071e3;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }
    .btn-delete { color: #f43f5e; transition: transform 0.2s; }
    .btn-delete:hover { transform: scale(1.2) rotate(10deg); color: #ef4444; }

    /* Content Explorer */
    .content-explorer {
      background: #ffffff;
      border-left: 1px solid rgba(0, 0, 0, 0.05);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 30px rgba(0,0,0,0.02);
    }
    .explorer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      color: #1d1d1f;
    }
    .explorer-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    .feed-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: #f5f5f7;
      border-radius: 16px;
      margin-bottom: 16px;
      transition: background 0.2s;
    }
    .feed-item:hover { background: #ebebef; }
    .feed-icon {
      background: rgba(0, 113, 227, 0.1);
      color: #0071e3;
      padding: 10px;
      border-radius: 50%;
      display: flex;
    }
    .feed-text { font-size: 0.95rem; color: #5e5e60; line-height: 1.4; }
    .feed-text strong { color: #1d1d1f; font-weight: 600; }
    .time { display: block; font-size: 0.8rem; color: #86868b; margin-top: 4px; font-weight: 500; }
  `]
})
export class DashboardComponent implements OnInit {
  projects = signal<Project[]>([]);
  feedItems = signal([
    { author: 'Artur', action: 'pushed to main', time: '5 mins ago' },
    { author: 'Backend API', action: 'deployed successfully', time: '1 hour ago' },
    { author: 'Jira Bot', action: 'imported 45 tasks', time: '3 hours ago' },
    { author: 'CI/CD', action: 'ran conventional commits check', time: 'Yesterday' }
  ]);

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.taskService.getProjects().subscribe(p => this.projects.set(p));
  }

  createProject() {
    const name = prompt('Project Name:');
    if (!name) return;
    this.taskService.createProject({ name, description: 'Standard enterprise project.' }).subscribe(() => this.loadProjects());
  }

  deleteProject(id: number) {
    if (confirm('Delete this project?')) {
      this.taskService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }

  goToBoard(id: number) {
    this.router.navigate(['/board', id]);
  }
}
