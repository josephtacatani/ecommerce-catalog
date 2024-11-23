import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Cart, CartItem } from './cartngrx/cart.models';
import { CartActions } from './cartngrx/cart.actions';
import { map, Observable } from 'rxjs';
import { selectCart, selectError, selectSuccessMessage } from './cartngrx/cart.reducers';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatSnackBarModule
  ]
})
export class CartComponent {
  cartItems$: Observable<(CartItem & { cart_id: string})[]>;
  message$: Observable<string | null>;
  error$: Observable<string | null>;
  grandTotal$: Observable<number>;

  constructor(
    private store: Store,
    private snackBar: MatSnackBar

  ) {
    this.store.dispatch(CartActions.loadCart());

    this.cartItems$ = this.store.select(selectCart).pipe(
      map((carts) =>
        carts
          ? carts.flatMap((cart) =>
              cart.items.map((item) => ({
                ...item,
                cart_id: cart.cart_id, // Include cart_id
              }))
            )
          : []
      ));
    


      this.message$ = this.store.select(selectSuccessMessage)

      this.message$.subscribe((message) => {
        if (message) {
          this.showSnackbar(message);
        }
      });

      this.error$ = this.store.select(selectError)

      this.error$.subscribe((error) => {
        if (error) {
          this.showSnackbar(error);
        }
      });

      this.grandTotal$ = this.cartItems$.pipe(
        map(items => items.reduce((sum, item) => sum + item.total_price, 0))
      );
    
  }





  removeItem(cart_id: string): void {
    this.store.dispatch(CartActions.deleteCartItem({ cart_id }));
  }

  removeAllItems(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  checkout(): void {
    alert('Proceeding to checkout...');
    // Add checkout logic here
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
