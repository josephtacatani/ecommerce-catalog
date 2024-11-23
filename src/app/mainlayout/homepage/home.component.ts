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


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    CartComponent,
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  loggeduser$: Observable<User | null>;
  userAccessLevel: string | null = null;
  products$: Observable<Product[] | null>
  

  constructor(private store: Store, private router: Router) {
    
    this.store.dispatch(UserActions.loadLoggedUser());
    this.store.dispatch(ProductActions.loadProducts());
    this.loggeduser$ = this.store.select(selectLoggedusers);
    this.products$ = this.store.select(selectProducts);


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
    const cartItem: CartItem = {
      product_name: product.product_name,
      quantity: 1,
      total_price: product.price,
      currency: product.currency,
      product_img: product.product_img,
      other_details: {},

    }
    this.store.dispatch(CartActions.addToCart({item:cartItem}))
  }

}
