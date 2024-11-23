// src/app/store/effects/user.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from './users.service';
import * as UserActions from './users.actions';



@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  // Load Users Effect (GET /users)
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          tap(response => console.log('API response:', response)), // Log the response to verify the structure
          map((response) => {
            console.log('Dispatching loadUsersSuccess with response:', response); // Log before dispatching
            return UserActions.loadUsersSuccess({ response });
          }),
          catchError((error) => {
            console.error('Error loading users:', error); // Log the error
            return of(UserActions.loadUsersFailure({ error: error.message }));
          })
        )
      )
    )
  );

    // Load Logged User Effect (GET /users)
    loadLoggedUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadLoggedUser),
        mergeMap(() =>
          this.userService.getLoggedUser().pipe(
          
            map((response) => {
            
              return UserActions.loadLoggedSuccess({ response });
            }),
            catchError((error) => {
            
              return of(UserActions.loadLoggedFailure({ error: error.message }));
            })
          )
        )
      )
    );

  // Create User Effect (POST /user)
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap((action) =>
        this.userService.createUser(action.userData).pipe(
          map((response) => UserActions.createUserSuccess({ response })),
          catchError((error) => of(UserActions.createUserFailure({ error: error.message })))
        )
      )
    )
  );

  refreshUsersAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUserSuccess),
      map(() => UserActions.loadUsers())
    )
  );

  // Update User Effect (PUT /user/{userId})
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.userId, action.userData).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => of(UserActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  refreshUsersAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserSuccess),
      map(() => UserActions.loadUsers())  // Dispatch loadUsers to refresh the list
    )
  );

  // Delete User Effect (DELETE /user/{userId})
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) =>
        this.userService.deleteUser(action.userId).pipe(
          map((response) => UserActions.deleteUserSuccess({ userId: action.userId, response })),
          catchError((error) => of(UserActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  );

    // Reload the users list after successful deletion
    refreshUsersAfterDelete$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        map(() => UserActions.loadUsers())
      )
    );
}
