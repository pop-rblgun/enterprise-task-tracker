import { createAction, props } from '@ngrx/store';
import { TaskItem, TaskStatus } from '../models/app.models';

// API Actions
export const loadTasks = createAction('[Board] Load Tasks', props<{ projectId: number }>());
export const loadTasksSuccess = createAction('[Board API] Load Tasks Success', props<{ tasks: TaskItem[] }>());

// SignalR Actions
export const taskCreatedViaSignalR = createAction('[SignalR] Task Created', props<{ task: TaskItem }>());
export const taskUpdatedViaSignalR = createAction('[SignalR] Task Updated', props<{ task: TaskItem }>());
export const taskDeletedViaSignalR = createAction('[SignalR] Task Deleted', props<{ taskId: number }>());

// Local Optimistic Actions
export const moveTask = createAction('[Board] Move Task', props<{ taskId: number, newStatus: TaskStatus, previousStatus: TaskStatus }>());
export const undoMoveTask = createAction('[Board] Undo Move Task');
