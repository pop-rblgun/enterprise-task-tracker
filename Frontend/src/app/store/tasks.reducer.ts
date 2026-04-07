import { createReducer, on } from '@ngrx/store';
import { TaskItem, TaskStatus } from '../models/app.models';
import * as TasksActions from './tasks.actions';

export interface TasksState {
  tasks: TaskItem[];
  undoStack: { taskId: number, previousStatus: TaskStatus }[];
}

export const initialState: TasksState = {
  tasks: [],
  undoStack: []
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    undoStack: [] // clear history on reload
  })),
  on(TasksActions.taskCreatedViaSignalR, (state, { task }) => {
    const exists = state.tasks.find(t => t.id === task.id);
    if (exists) return state;
    return { ...state, tasks: [...state.tasks, task] };
  }),
  on(TasksActions.taskUpdatedViaSignalR, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),
  on(TasksActions.taskDeletedViaSignalR, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== taskId)
  })),
  on(TasksActions.moveTask, (state, { taskId, newStatus, previousStatus }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    undoStack: [...state.undoStack, { taskId, previousStatus }]
  })),
  on(TasksActions.undoMoveTask, (state) => {
    if (state.undoStack.length === 0) return state;
    const lastAction = state.undoStack[state.undoStack.length - 1];
    const newStack = state.undoStack.slice(0, -1);
    
    return {
      ...state,
      tasks: state.tasks.map(t => t.id === lastAction.taskId ? { ...t, status: lastAction.previousStatus } : t),
      undoStack: newStack
    };
  })
);
