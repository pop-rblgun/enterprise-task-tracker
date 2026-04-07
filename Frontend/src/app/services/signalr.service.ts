import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { TaskItem as Task } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  public taskCreated$ = new Subject<Task>();
  public taskUpdated$ = new Subject<Task>();
  public taskDeleted$ = new Subject<number>();

  constructor() {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5031/taskhub', {
        // Required for cookies/auth if needed, but we might just use default
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch((err: any) => console.log('Error while starting connection: ' + err));
      
    this.addListeners();
  }

  public joinProject(projectId: number) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('JoinProject', projectId.toString())
        .catch(err => console.error(err));
    }
  }

  public leaveProject(projectId: number) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('LeaveProject', projectId.toString())
        .catch(err => console.error(err));
    }
  }

  private addListeners() {
    if (!this.hubConnection) return;

    this.hubConnection.on('TaskCreated', (task: Task) => {
      this.taskCreated$.next(task);
    });

    this.hubConnection.on('TaskUpdated', (task: Task) => {
      this.taskUpdated$.next(task);
    });

    this.hubConnection.on('TaskDeleted', (taskId: number) => {
      this.taskDeleted$.next(taskId);
    });
  }
}
