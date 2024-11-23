// Represents the features of a product
export interface Features {
    memory: string;
    screen: string;
  }
  
  // Represents additional details for a product
  export interface OtherDetails {
    [sectionName: string]: { [key: string]: string }; 
  }
  
  // Represents an individual item in the cart
  export interface CartItem {
    product_name: string;
    quantity: number;
    total_price: number;
    currency: string;
    product_img: string;
    other_details: OtherDetails;
  }
  
  // Represents a cart with multiple items
  export interface Cart {
    cart_id: string;
    items: CartItem[];
    created_at: string;
  }
  
  // Represents the structure of the `POST` response
  export interface CartResponse {
    data: {
      message: string;
      user_id: string;
      cart: Cart[];
    };
  }
  