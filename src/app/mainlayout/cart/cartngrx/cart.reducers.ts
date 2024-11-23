import { createFeature, createReducer, on } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { Cart } from './cart.models';

export interface CartState {
  cart: Cart[] | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    // Load Cart
    on(CartActions.loadCart, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CartActions.loadCartSuccess, (state, { response }) => ({
      ...state,
      cart: response.data.cart,
      loading: false,
      successMessage: response.data.message,
    })),
    on(CartActions.loadCartFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),

    // Add To Cart
    on(CartActions.addToCart, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CartActions.addToCartSuccess, (state, { response }) => ({
      ...state,
      cart: response.data.cart,
      successMessage: response.data.message,
      loading: false,
    })),
    on(CartActions.addToCartFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
        // Delete Cart Item
        on(CartActions.deleteCartItem, (state) => ({
          ...state,
          loading: true,
          error: null,
        })),
        on(CartActions.deleteCartItemSuccess, (state, { response, cart_id }) => ({
          ...state,
          cart: state.cart
            ? state.cart.map((cart) =>
                cart.cart_id === cart_id // Match the correct Cart by cart_id
                  ? {
                      ...cart,
                      items: [], // Remove all items from this cart or filter items if necessary
                    }
                  : cart // Keep other carts unchanged
              )
            : null,
          loading: false,
          successMessage: response.data.message,
        })),
        

        on(CartActions.deleteCartItemFailure, (state, { error }) => ({
          ...state,
          error,
          loading: false,
        })),
    
        // Clear Cart
        on(CartActions.clearCart, (state) => ({
          ...state,
          loading: true,
          error: null,
        })),
        on(CartActions.clearCartSuccess, (state, { message }) => ({
          ...state,
          cart: [], // Empty the cart
          successMessage: message,
          loading: false,
          error: null,
        })),
        on(CartActions.clearCartFailure, (state, { error }) => ({
          ...state,
          error,
          loading: false,
        }))

    
  ),
});

export const { name, reducer,  } = cartFeature;


export const {
    name: cartFeatureKey,        // Feature name
    reducer: cartReducer,        // Reducer function
    selectCart, 
    selectLoading, 
    selectError,
    selectSuccessMessage,
  } = cartFeature;
  