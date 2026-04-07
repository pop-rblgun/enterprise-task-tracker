import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, TaskItem } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = 'http://localhost:5210/api';

  constructor(private http: HttpClient) {}

  // Projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }

  // Tasks
  getTasksByProject(projectId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.baseUrl}/tasks/project/${projectId}`);
  }

  createTask(task: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: number, task: Partial<TaskItem>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  // Jira
  importFromJira(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/jira/import`, request);
  }
}
