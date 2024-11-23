
export interface UserInterface {
    id: string;
    username: string;
    role: string;
  }

  export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    date_created: string; // ISO string format
    username: string;
    access_level: string | null;
    user_img: string;
    position: string | null;  // Nullable fields as per API response
    department: string | null;
    branch: string | null;
    group_tag: string | null;
    status: string | null;
  }



// Interface for the response when creating a user
export interface CreateUserResponse {
  data: {
    message: string;
    user: User[];
  };
}

// Interface for the response when retrieving all users
export interface GetUsersResponse {
  data: {
    users: User[];  // The array of users is within the "data" property
  };
}

export interface GetLoggedUserResponse {
  data: User;
}


// Interface for the response when deleting a user
export interface DeleteUserResponse {
  data: {
    message: string;
  };
}

// Request structure for creating a user
export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  username: string;
  password: string;
  access_level: string;
  user_img: string;
  position: string;
  department: string;
  branch: string;
  status: string;
}


// Request structure for updating a user
export interface UpdateUserRequest {
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  username: string;
  password?: string;  // Optional for update
  access_level: string;
  user_img: string;
  position: string;
  department: string;
  branch: string;
  status: string;
}


// NgRx State interface for User
export interface UserState {
  users: any[]; // Adjust type as necessary
  selectedUser: any | null; // Adjust type as necessary
  loading: boolean;
  error: string | null;
  loggedusers: User | null;

  // Additional state properties
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

export interface UserResponseInterface{
  data: {
    message: string;
    data: any;
    error: string;
  }
}