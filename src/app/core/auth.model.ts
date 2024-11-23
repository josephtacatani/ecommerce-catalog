import { UserInterface } from "./user.model";

export interface AuthRequestInterface {
    username: string;
    password: string;
  }

  
  export interface AuthResponseInterface {
    data: {
      message: string;
      token: string;
      user?: UserInterface | null; // Using UserInterface here
    };
  }

  export interface AuthErrorInterface {
    data: {
        error: string;
    }
  }

  export interface RegisterRequestInterface {
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    username: string;
    password: string;
    access_level: string;
  }
  

  export interface RegisterResponseInterface {
    data: {
      message: string;
    };
  }

  export interface RegisterErrorResponseInterface {
    data: {
      error: string;
    };
  }
  

  export interface ForgotPasswordRequestInterface{
    username: string;
  }


  export interface ForgotPasswordResponseInterface{
    data: {
      message: string;
      otp: string;
    }
  }

  export interface ChangePasswordRequestInterface{
   
    otp: string
    newPassword: string;

    
  }

  export interface ChangePasswordResponseInterface{
    data: {
      message: string;
    }

  }

  export interface ChangePasswordErrorInterface {
    data: {
      message: string;
    }
  }
  
