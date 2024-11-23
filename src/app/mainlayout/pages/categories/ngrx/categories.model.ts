export interface Categories {
    category_id: string; // Unique identifier for the category
    category_name: string; // Name of the category
    date_created: string; // ISO string format for creation date
    created_by: string; // User who created the category
    group_tag: string; // Group tag for the category
  }
  
  export interface CategoryRequestInterface {
    category_name: string; // Payload for creating/updating a category
  }

  export interface CategoryErrorInterface {
    data: {
        error: string;
    }
  }
  
  export interface CategoryResponseInterface {
    data: Categories[]; 
  }
  
  export interface CategoryState {
    categories: Categories[]; // List of categories
    loading: boolean; // Indicates if data is being loaded
    isSubmitting: boolean; // Indicates if a create/update operation is in progress
    error: string | null; // Error message if something goes wrong
    successMessage: string | null; // Success message for UI notifications
  }
  