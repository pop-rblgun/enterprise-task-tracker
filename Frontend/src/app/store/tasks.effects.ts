import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '../services/task.service';
import * as TasksActions from './tasks.actions';
import { mergeMap, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  private store = inject(Store);

  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(TasksActions.loadTasks),
    mergeMap(action => this.taskService.getTasksByProject(action.projectId)
      .pipe(
        map(tasks => TasksActions.loadTasksSuccess({ tasks }))
      )
    )
  ));

  // When moveTask happens optimistically, we still need to send it to the backend.
  // We should fetch from taskService.
  moveTask$ = createEffect(() => this.actions$.pipe(
    ofType(TasksActions.moveTask),
    tap(action => {
      // In a real app we would read the full task from store. 
      // For this demo, let's let the board component handle the API call so we don't over-engineer.
      // Or we can just do a partial update if API supports it. We'll skip complex effect logic and trigger API in the component for simplicity, using NgRx just for state and undo stack.
    })
  ), { dispatch: false });
}
