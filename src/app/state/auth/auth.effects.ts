import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../auth/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Router } from '@angular/router';
import { AuthResponseInterface, ChangePasswordResponseInterface, ForgotPasswordResponseInterface, RegisterResponseInterface } from 'src/app/core/auth.model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // Effect for handling login action
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login(action.credentials).pipe(
          map((response: AuthResponseInterface) => 
            AuthActions.loginSuccess({
              response: {
                data: {
                  message: response.data.message,       // Ensure message is provided
                  token: response.data.token,
                  user: response.data.user || null     // Ensure user is explicitly set, even if null
                }
              }
            })
          ),
          catchError((errorResponse) => {
            const error = errorResponse.error;
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          localStorage.setItem('authToken', response.data.token);
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        mergeMap(() =>
          this.authService.logout().pipe( // Call the logout API endpoint
            tap(() => {
              localStorage.removeItem('authToken');
              this.router.navigate(['/login']);
            })
          )
        )
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(action =>
        this.authService.register(action.data).pipe(
          map((response: RegisterResponseInterface) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );

  verify$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.verifyUsername),
    mergeMap(action =>
      this.authService.verifyusername(action.data).pipe(
        map((response: ForgotPasswordResponseInterface) => AuthActions.verifyUsernameSuccess ({ response})),
        catchError((error) => of(AuthActions.verifyUSernameFailure({error})))
      )
    )
  )
  
  );

  changepassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      mergeMap(action =>
        this.authService.chnagePassword(action.data).pipe(
          map((response: ChangePasswordResponseInterface) => AuthActions.changePasswordSuccess({response})),
          catchError((error) => of(AuthActions.changePasswordFailure({error})))
        )
      )
    )
    
    );



}
