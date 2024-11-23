import { createAction, props } from '@ngrx/store';


import { CreateUserRequest, CreateUserResponse, DeleteUserResponse, GetLoggedUserResponse, GetUsersResponse, UpdateUserRequest, User } from 'src/app/core/user.model';


// Load LoggedIn User
export const loadLoggedUser = createAction('[User] Load Logged Users');
export const loadLoggedSuccess = createAction(
  '[User] Load Logged Users Success',
  props<{ response: GetLoggedUserResponse }>()  // Adjust based on actual API response if needed
);
export const loadLoggedFailure = createAction(
  '[User] Load Logged Users Failure',
  props<{ error: string }>()
);


// Load Users Actions
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ response: GetUsersResponse }>()  // Adjust based on actual API response if needed
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

// Create User Actions
export const createUser = createAction(
  '[User] Create User',
  props<{ userData: CreateUserRequest }>()
);
export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ response: CreateUserResponse }>()
);
export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: string }>()
);

// Update User Actions
export const updateUser = createAction(
  '[User] Update User',
  props<{ userId: string; userData: UpdateUserRequest }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User; }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
);

// Delete User Actions
export const deleteUser = createAction(
  '[User] Delete User',
  props<{ userId: string }>()
);
export const deleteUserSuccess = createAction(
  '[User] Delete User Success',
  props<{ userId: string; response: DeleteUserResponse }>()
);
export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: string }>()
);
