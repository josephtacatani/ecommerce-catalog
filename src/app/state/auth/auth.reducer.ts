import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { UserInterface } from 'src/app/core/user.model';


// Define the AuthState interface
export interface AuthState {
  token: string | null;
  user: UserInterface | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  validationErrors: string | null;

  // Registration-specific state
  registerSuccessMessage: string | null;
  registerError: string | null;

  verificationSuccessMessage: string | null;
  verificationFailureMessage: string | null;
  verificationOTP: string | null;

  //chnagepassword
  changePasswordMessage: string | null;
  changePasswordFailure: string | null;

}

// Initial state for the auth feature
const initialState: AuthState = {
  token: null,
  user: null,
  errorMessage: null,
  isAuthenticated: false,
  isLoading: false,
  isSubmitting: false,
  validationErrors: null,

  // Registration-specific initial state
  registerSuccessMessage: null,
  registerError: null,
  verificationSuccessMessage: null,
  verificationFailureMessage: null,
  verificationOTP: null,

    //chnagepassword
    changePasswordMessage: null,
    changePasswordFailure:  null
};

// Define the auth feature using `authFeature` as the name
export const authFeature = createFeature({
  name: 'auth', // Feature key set to 'authFeature'
  reducer: createReducer(
    initialState,

    // Handle login action
    on(AuthActions.login, state => ({
      ...state,
      isSubmitting: true,
      errorMessage: null,
      validationErrors: null,
    })),

    // Handle login success
    on(AuthActions.loginSuccess, (state, { response }) => ({
      ...state,
      token: response.data.token,
      user: response.data.user || null,
      errorMessage: null,
      isAuthenticated: true,
      isSubmitting: false,
    })),

    // Handle login failure
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      errorMessage: error.data.error,
      isAuthenticated: false,
      isSubmitting: false,
      validationErrors: error.data.error, // Assuming validation errors are returned as a string
    })),

    // Handle logout
    on(AuthActions.logout, () => initialState),

    on(AuthActions.register, state => ({
        ...state,
        isSubmitting: true,
        registerSuccessMessage: null,
        registerError: null,
      })),
  
      // Handle register success
      on(AuthActions.registerSuccess, (state, { response }) => ({
        ...state,
        registerSuccessMessage: response.data.message, // Store success message
        registerError: null,
        isSubmitting: false,
      })),
  
      // Handle register failure
      on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        registerSuccessMessage: null,
        registerError: error.data?.error || 'Registration failed',
        isSubmitting: false,
      })),

      // VerifyOTP
      on(AuthActions.verifyUsername, (state) => ({
        ...state,
        verificationSuccessMessage: null,
        verificationFailureMessage: null,
        isSubmitting: true,
      })),

      on(AuthActions.verifyUsernameSuccess, (state, { response }) => ({
        ...state,
        verificationSuccessMessage: response.data.message, 
        verificationOTP: response.data.otp,
        isSubmitting: false,
      })),
  
  
      on(AuthActions.verifyUSernameFailure, (state, { error }) => ({
        ...state,
        verificationSuccessMessage: null,
        verificationFailureMessage: error.data?.error || 'Username Verification Failed',
        isSubmitting: false,
      })),

      //change password
      on(AuthActions.changePassword, (state) => ({
        ...state,
        isSubmitting: false,
      })),

      on(AuthActions.changePasswordSuccess, (state, { response }) => ({
        ...state,
        changePasswordMessage: response.data.message,
        isSubmitting: true,
      })),
  
  
      on(AuthActions.changePasswordFailure, (state, { error }) => ({
        ...state,
        changePasswordFailure: error.data?.message || 'Change Password Failed',
        isSubmitting: false,
      })),
  )
});

// Destructure specific properties from authFeature for easy access
export const {
  name: authFeatureKey,        // Feature name
  reducer: authReducer,        // Reducer function
  selectIsAuthenticated,       // Selector for `isAuthenticated`
  selectToken,                 // Selector for `token`
  selectUser,                  // Selector for `user`
  selectErrorMessage,          // Selector for `errorMessage`
  selectIsSubmitting,          // Selector for `isSubmitting`
  selectIsLoading,             // Selector for `isLoading`
  selectValidationErrors,      // Selector for `validationErrors`
  selectRegisterSuccessMessage,         // Selector for registration success message
  selectRegisterError,                  // Selector for registration error
  selectVerificationSuccessMessage,
  selectVerificationFailureMessage,
  selectVerificationOTP,
  selectChangePasswordMessage,
  selectChangePasswordFailure
} = authFeature;
