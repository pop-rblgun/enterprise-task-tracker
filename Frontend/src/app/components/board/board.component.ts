import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { SignalRService } from '../../services/signalr.service';
import { TaskItem, TaskStatus, TaskPriority } from '../../models/app.models';
import { Store } from '@ngrx/store';
import * as TasksActions from '../../store/tasks.actions';
import { selectAllTasks, selectUndoAvailable } from '../../store/tasks.selectors';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatDialogModule],
  template: `
    <div class="board-wrapper">
      <header class="board-header">
        <button mat-icon-button (click)="goBack()"><mat-icon>arrow_back</mat-icon></button>
        <h2>Project Board</h2>
        <div class="header-actions">
          <button mat-flat-button color="warn" (click)="undo()" *ngIf="undoAvailable()">
            <mat-icon>undo</mat-icon> UNDO
          </button>
          <button mat-flat-button color="accent" (click)="importFromJira()">
            <mat-icon>cloud_download</mat-icon> IMPORT JIRA
          </button>
          <button mat-flat-button color="primary" (click)="addTask()">
            <mat-icon>add</mat-icon> ADD TASK
          </button>
        </div>
      </header>

      <div class="kanban-board" cdkDropListGroup>
        <div *ngFor="let col of columns" class="column-container">
          <div class="column-header">
            <h3>{{col.name}} ({{getTasksByStatus(col.status).length}})</h3>
          </div>
          
          <div
            cdkDropList
            [cdkDropListData]="getTasksByStatus(col.status)"
            (cdkDropListDropped)="drop($event, col.status)"
            class="task-list">
            
            <mat-card *ngFor="let task of getTasksByStatus(col.status)" cdkDrag class="task-card">
              <mat-card-header>
                <mat-card-title>{{task.title}}</mat-card-title>
                <div *ngIf="task.jiraKey" class="jira-key">{{task.jiraKey}}</div>
              </mat-card-header>
              <mat-card-content>
                <p>{{task.description}}</p>
                <mat-chip-set>
                  <mat-chip [ngClass]="getPriorityClass(task.priority)">{{task.priority}}</mat-chip>
                </mat-chip-set>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board-wrapper { height: 100vh; display: flex; flex-direction: column; background: var(--bg-light); color: #1d1d1f; }
    .board-header { padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.05); z-index: 10; }
    .board-header h2 { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
    .header-actions { display: flex; gap: 12px; }
    .kanban-board { flex: 1; display: flex; padding: 32px; gap: 24px; overflow-x: auto; }
    .column-container { width: 340px; min-width: 340px; display: flex; flex-direction: column; background: rgba(235, 235, 239, 0.6); border-radius: 16px; padding: 16px; }
    .column-header { padding: 4px 8px 16px 8px; }
    .column-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: #5e5e60; }
    .task-list { flex: 1; min-height: 200px; display: flex; flex-direction: column; gap: 12px; border-radius: 12px; }
    .task-card { cursor: grab; padding: 12px; background: #ffffff; border: 1px solid rgba(0,0,0,0.02); border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); transition: transform 0.2s, box-shadow 0.2s; }
    .task-card:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); transform: translateY(-2px); }
    .task-card:active { cursor: grabbing; }
    ::ng-deep .task-card mat-card-title { font-size: 1.05rem; font-weight: 600; color: #1d1d1f; margin-bottom: 4px; letter-spacing: -0.01em; }
    ::ng-deep .task-card mat-card-content p { font-size: 0.9rem; color: #5e5e60; margin-bottom: 12px; line-height: 1.4; }
    .jira-key { font-size: 0.7rem; font-weight: 600; background: rgba(0, 113, 227, 0.1); color: #0071e3; padding: 4px 8px; border-radius: 6px; display: inline-block; position: absolute; top: 12px; right: 12px; }
    .low { background: #f5f5f7 !important; color: #5e5e60 !important; font-weight: 500; border: 1px solid #e5e5ea; }
    .medium { background: rgba(0, 113, 227, 0.1) !important; color: #0071e3 !important; font-weight: 600; }
    .high { background: rgba(255, 59, 48, 0.1) !important; color: #ff3b30 !important; font-weight: 600; }
    .critical { background: #ff3b30 !important; color: white !important; font-weight: 600; box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3); }
  `]
})
export class BoardComponent implements OnInit {
  private store = inject(Store);
  projectId!: number;
  tasks = this.store.selectSignal(selectAllTasks);
  undoAvailable = this.store.selectSignal(selectUndoAvailable);
  columns = [
    { name: 'To Do', status: TaskStatus.Todo },
    { name: 'In Progress', status: TaskStatus.InProgress },
    { name: 'Review', status: TaskStatus.Review },
    { name: 'Done', status: TaskStatus.Done }
  ];

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private taskService: TaskService,
    private signalR: SignalRService
  ) {}

  ngOnInit() {
    this.projectId = +this.route.snapshot.params['projectId'];
    this.loadTasks();

    // SignalR Real-Time Subscription
    this.signalR.startConnection();
    this.signalR.joinProject(this.projectId);

    this.signalR.taskCreated$.subscribe(task => this.store.dispatch(TasksActions.taskCreatedViaSignalR({ task })));
    this.signalR.taskUpdated$.subscribe(task => this.store.dispatch(TasksActions.taskUpdatedViaSignalR({ task })));
    this.signalR.taskDeleted$.subscribe(taskId => this.store.dispatch(TasksActions.taskDeletedViaSignalR({ taskId })));
  }

  loadTasks() {
    this.store.dispatch(TasksActions.loadTasks({ projectId: this.projectId }));
  }

  getTasksByStatus(status: TaskStatus) {
    return this.tasks().filter(t => t.status === status);
  }

  drop(event: CdkDragDrop<TaskItem[]>, status: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const previousStatus = task.status;
      task.status = status;
      
      // Dispatch optimistic UI update + save history for Undo
      this.store.dispatch(TasksActions.moveTask({ taskId: task.id, newStatus: status, previousStatus }));
      
      // Send API request (real app would use an Effect, but we do it inline here)
      this.taskService.updateTask(task.id, task).subscribe();
      
      // We don't need transferArrayItem because NgRx will rerender since tasks signal changed
    }
  }

  undo() {
    this.store.dispatch(TasksActions.undoMoveTask());
    // NOTE: In a real app we'd dispatch another API call to revert on backend
    // Or we could get the newly reverted task state and send to backend
    const revertedTaskId = this.tasks()[0].id; // Simplified
  }

  addTask() {
    const title = prompt('Task Title:');
    if (!title) return;
    this.taskService.createTask({
      title,
      description: 'New enterprise task.',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      projectId: this.projectId
    }).subscribe(() => this.loadTasks());
  }

  importFromJira() {
    const domain = prompt('Jira Domain (e.g. your-org):');
    const email = prompt('Jira Email:');
    const apiToken = prompt('Jira API Token:');
    const projectKey = prompt('Jira Project Key (e.g. PRJ):');
    
    if (!domain || !email || !apiToken || !projectKey) return;
    
    this.taskService.importFromJira({
      domain, email, apiToken, projectKey, localProjectId: this.projectId
    }).subscribe(res => {
      alert(res.message);
      this.loadTasks();
    });
  }

  getPriorityClass(p: TaskPriority) {
    return p.toString().toLowerCase();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
