import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state: TasksState) => state.tasks
);

export const selectUndoAvailable = createSelector(
  selectTasksState,
  (state: TasksState) => state.undoStack.length > 0
);
