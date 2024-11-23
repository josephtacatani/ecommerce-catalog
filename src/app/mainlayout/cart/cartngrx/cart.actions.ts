import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { CartItem, CartResponse } from './cart.models';


export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    // Load Cart
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ response: CartResponse }>(),
    'Load Cart Failure': props<{ error: string }>(),

    // Add to Cart
    'Add To Cart': props<{ item: CartItem }>(),
    'Add To Cart Success': props<{ response: CartResponse; }>(),
    'Add To Cart Failure': props<{ error: string }>(),

    // Delete a single item
    'Delete Cart Item': props<{ cart_id: string }>(),
    'Delete Cart Item Success': props<{response: CartResponse; cart_id: string}>(),
    'Delete Cart Item Failure': props<{ error: string }>(),

    // Clear all items
    'Clear Cart': emptyProps(),
    'Clear Cart Success': props<{ message: string }>(),
    'Clear Cart Failure': props<{ error: string }>(),
  },
});
