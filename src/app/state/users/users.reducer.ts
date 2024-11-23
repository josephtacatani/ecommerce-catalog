// src/app/store/reducers/user.reducer.ts

import { createFeature, createReducer, on } from '@ngrx/store';
import { UserState } from 'src/app/core/user.model';
import * as UserActions from './users.actions';

// Define the UserState interface


// Initial state for the user feature
const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  loggedusers: null,

  // Additional initial state properties
  isSubmitting: false,
  successMessage: null,
  errorMessage: null,
};

// Define the user feature using `userFeature` as the name
export const userFeature = createFeature({
  name: 'user', // Feature key set to 'user'
  reducer: createReducer(
    initialState,

    // Load Users
    on(UserActions.loadUsers, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(UserActions.loadUsersSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      users: response.data.users,
      successMessage: 'Users loaded successfully', // Optional success message
    })),
    on(UserActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: error,
    })),

        // Load Logged User
        on(UserActions.loadLoggedUser, (state) => ({
          ...state,
          loading: true,
          error: null,
        })),
        on(UserActions.loadLoggedSuccess, (state, { response }) => ({
          ...state,
          loading: false,
          loggedusers: response.data,
          successMessage: 'Logged User loaded successfully', // Optional success message
        })),
        on(UserActions.loadLoggedFailure, (state, { error }) => ({
          ...state,
          loading: false,
          error: error,
        })),

    // Create User
    on(UserActions.createUser, (state) => ({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    })),
    on(UserActions.createUserSuccess, (state, { response }) => ({
      ...state,
      isSubmitting: false,
      users: [...state.users, response.data.user],
      successMessage: 'User created successfully', // Optional success message
    })),
    on(UserActions.createUserFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      errorMessage: error,
    })),

    // Update User
    on(UserActions.updateUser, (state) => ({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    })),
    on(UserActions.updateUserSuccess, (state, { user }) => ({
      ...state,
      isSubmitting: false,
      users: state.users.map((u) => (u.user_id === user.user_id ? user : u)),
      successMessage: 'User updated successfully', // Optional success message
    })),
    on(UserActions.updateUserFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      errorMessage: error,
    })),

    // Delete User
    on(UserActions.deleteUser, (state) => ({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    })),
    on(UserActions.deleteUserSuccess, (state, { userId }) => ({
      ...state,
      isSubmitting: false,
      users: state.users.filter((user) => user.user_id !== userId),
      successMessage: 'User deleted successfully', // Optional success message
    })),
    on(UserActions.deleteUserFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      errorMessage: error,
    }))
  ),
});

// Destructure specific properties from userFeature for easy access
export const {
  name: userFeatureKey,        // Feature name
  reducer: userReducer,        // Reducer function
  selectUsers,                 // Selector for `users`
  selectSelectedUser,          // Selector for `selectedUser`
  selectLoading,               // Selector for `loading`
  selectError,                 // Selector for `error`
  selectIsSubmitting,          // Selector for `isSubmitting`
  selectSuccessMessage,        // Selector for success message
  selectErrorMessage,          // Selector for error message
  selectLoggedusers,
} = userFeature;
