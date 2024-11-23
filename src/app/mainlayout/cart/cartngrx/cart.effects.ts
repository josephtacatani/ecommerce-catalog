import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from './cart.service';
import { CartActions } from './cart.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private cartService: CartService) {}

  // Load Cart
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe(
          map((response) => CartActions.loadCartSuccess({ response })),
          catchError((error) => of(CartActions.loadCartFailure({ error: error.message })))
        )
      )
    )
  );

  // Add To Cart
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap((action) =>
        this.cartService.addToCart(action.item).pipe(
          map((response) => CartActions.addToCartSuccess({ response })),
          catchError((error) => of(CartActions.addToCartFailure({ error: error.message })))
        )
      )
    )
  );

    // Delete Cart Item
    deleteCartItem$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CartActions.deleteCartItem),
        mergeMap((action) =>
          this.cartService.deleteCartItem(action.cart_id).pipe(
            map((response) =>
              CartActions.deleteCartItemSuccess({
                response,
                cart_id: action.cart_id
              })
            ),
            catchError((error) =>
              of(CartActions.deleteCartItemFailure({ error: error.message }))
            )
          )
        )
      )
    );
  
    // Reload cart after successful item deletion
    reloadCartAfterDelete$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CartActions.deleteCartItemSuccess),
        map(() => CartActions.loadCart()) // Dispatch Load Cart
      )
    );
  
    // Clear Cart
    clearCart$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CartActions.clearCart),
        mergeMap(() =>
          this.cartService.clearCart().pipe(
            map((response) => CartActions.clearCartSuccess({ message: response.message })),
            catchError((error) =>
              of(CartActions.clearCartFailure({ error: error.message }))
            )
          )
        )
      )
    );
  
    // Reload cart after successful clear
    reloadCartAfterClear$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CartActions.clearCartSuccess),
        map(() => CartActions.loadCart()) // Dispatch Load Cart
      )
    );
  
}
