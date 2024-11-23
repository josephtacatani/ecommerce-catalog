import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartItem } from '../cart/cartngrx/cart.models';
import { CartActions } from '../cart/cartngrx/cart.actions';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from '../cart/cart.component';
import { CommonModule } from '@angular/common';
import { filter, Observable, take } from 'rxjs';
import { User } from 'src/app/core/user.model';
import { selectLoggedusers, selectUsers } from 'src/app/state/users/users.reducer';
import { AuthActions } from 'src/app/state/auth/auth.actions';
import * as UserActions from '../../state/users/users.actions';
import { Router } from '@angular/router';
import { Product } from '../pages/products/ngrx/products.models';
import { ProductActions } from '../pages/products/ngrx/products.actions';
import { selectProducts } from '../pages/products/ngrx/products.reducers';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { selectError, selectSuccessMessage } from '../cart/cartngrx/cart.reducers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    CartComponent,
    CommonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class HomeComponent implements OnInit {
  loggeduser$: Observable<User | null>;
  userAccessLevel: string | null = null;
  products$: Observable<Product[] | null>
  productQuantities: { [key: string]: number } = {};
  message$: Observable<string | null>;
  error$: Observable<string | null>;
  

  

  constructor(
    private store: Store, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    
    this.store.dispatch(UserActions.loadLoggedUser());
    this.store.dispatch(ProductActions.loadProducts());
    this.loggeduser$ = this.store.select(selectLoggedusers);
    this.products$ = this.store.select(selectProducts);
    this.message$ = this.store.select(selectSuccessMessage);
    this.error$ = this.store.select(selectError);


    this.loggeduser$
    .pipe(
      filter((user): user is User => !!user) // Only proceed when user data is loaded
    )
    .subscribe((user) => {
      if (user.access_level === 'admin') {
        this.router.navigate(['/dashboard']);
      }
      else{
        this.router.navigate(['/home']);
      }
    });

    this.error$.subscribe((error) => {
      if (error) {
        console.error('Error received in component:', error); // Log the error
        this.showSnackbar(error); // Optionally show the error in the UI
      }
    });
  
    this.message$.subscribe((message) => {
      if (message) {
        this.showSnackbar(message);
      }
    });


  }

  isCartVisible = false;



  ngOnInit(): void {

  }

  logout(){
    this.store.dispatch(AuthActions.logout())
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  addToCart(product: Product): void{
    const quantity = this.productQuantities[product.product_name] || 1;
    const cartItem: CartItem = {
      product_name: product.product_name,
      quantity,
      total_price: product.price * quantity,
      currency: product.currency,
      product_img: product.product_img,
      other_details: {},

    }
    this.store.dispatch(CartActions.addToCart({item:cartItem}))
  }

  increaseQuantity(product: Product): void {
    const currentQuantity = this.productQuantities[product.product_name] || 1;
    this.productQuantities[product.product_name] = currentQuantity + 1;
  }
  
  decreaseQuantity(product: Product): void {
    const currentQuantity = this.productQuantities[product.product_name] || 1;
    if (currentQuantity > 1) {
      this.productQuantities[product.product_name] = currentQuantity - 1;
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }



  
  

}
