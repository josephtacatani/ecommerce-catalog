import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { AuthErrorInterface, AuthRequestInterface, AuthResponseInterface, ChangePasswordErrorInterface, ChangePasswordRequestInterface, ChangePasswordResponseInterface, ForgotPasswordRequestInterface, ForgotPasswordResponseInterface, RegisterErrorResponseInterface, RegisterRequestInterface, RegisterResponseInterface } from 'src/app/core/auth.model';


export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: AuthRequestInterface }>(),
    'Login Success': props<{ response: AuthResponseInterface }>(),
    'Login Failure': props<{ error: AuthErrorInterface }>(),
    'Logout': emptyProps(),
    'Register': props<{ data: RegisterRequestInterface }>(),
    'Register Success': props<{ response: RegisterResponseInterface }>(),
    'Register Failure': props<{ error: RegisterErrorResponseInterface }>(),

    'Verify Username': props<{ data: ForgotPasswordRequestInterface }>(),
    'Verify Username Success': props<{ response: ForgotPasswordResponseInterface }>(),
    'Verify USername Failure': props<{ error: RegisterErrorResponseInterface }>(),

    'Change Password': props<{ data: ChangePasswordRequestInterface }>(),
    'Change Password Success': props<{ response: ChangePasswordResponseInterface }>(),
    'Change Password Failure': props<{ error: ChangePasswordErrorInterface }>(),
  }
});
