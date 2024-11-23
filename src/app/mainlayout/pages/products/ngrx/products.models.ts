import { Categories } from "../../categories/ngrx/categories.model";

// Represents a single product in the system
export interface Product {
    product_id: string;
    product_name: string;
    product_img: string;
    product_description: string;
    price: number;
    currency: string;
    category: Categories[]; // Array of category IDs
    created_by: string;
    other_details: OtherDetails;
  }


  export interface OtherDetails {
    [sectionName: string]: 
    { [key: string]: string }; // Section name and its key-value pairs
  }
  
  // Request format for creating or updating a product
  export interface ProductRequest {
    product_name: string;
    product_img: string;
    product_description: string;
    price: number;
    currency: string;
    category: Categories[];
    created_by: string;
    other_details: OtherDetails;
  }
  
  // Response format from the API when loading products
  export interface ProductResponse {
    data: {
      products: Product[];
    }  // Array of products
    message: string; // Success or status message from the API
  }
  


  
  // NgRx state interface for managing products
  export interface ProductState {
    products: Product[]; // List of products
    loading: boolean; // For indicating loading state
    isSubmitting: boolean; // For indicating submission state (create, update, delete)
    error: string | null; // Error message, if any
    successMessage: string | null; // Success message, if any
  } 
  