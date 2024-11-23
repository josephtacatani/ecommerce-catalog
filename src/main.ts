import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authFeatureKey, authReducer } from './app/state/auth/auth.reducer';
import { AuthEffects } from './app/state/auth/auth.effects';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './environment/environment';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/auth/login/login.component';
import { RegisterComponent } from './app/auth/register/register.component';
import { DashboardComponent } from './app/mainlayout/dashboard/dashboard.component';
import { AuthGuard } from './app/auth/auth.guard';
import { CategoriesComponent } from './app/mainlayout/pages/categories/categories.component';

import { TransactionsComponent } from './app/mainlayout/pages/transactions/transactions.component';
import { UserListComponent } from './app/mainlayout/pages/users/user-list.component';
import { userFeatureKey, userReducer } from './app/state/users/users.reducer';
import { UserEffects } from './app/state/users/users.effects';
import { ForgotPasswordComponent } from './app/auth/forgotpassword/forgotpassword.component';
import { categoryFeatureKey, categoryReducer } from './app/mainlayout/pages/categories/ngrx/categories.reducers';
import { CategoryEffects } from './app/mainlayout/pages/categories/ngrx/categories.effects';
import { ProductsComponent } from './app/mainlayout/pages/products/products.component';
import { productFeatureKey, productReducer } from './app/mainlayout/pages/products/ngrx/products.reducers';
import { ProductEffects } from './app/mainlayout/pages/products/ngrx/products.effects';
import { cartFeatureKey, cartReducer } from './app/mainlayout/cart/cartngrx/cart.reducers';
import { HomeComponent } from './app/mainlayout/homepage/home.component';
import { CartEffects } from './app/mainlayout/cart/cartngrx/cart.effects';




const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: '', component: RegisterComponent },

  // Protected routes with Dashboard layout
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protect Dashboard with AuthGuard
    children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'users', component: UserListComponent },
      // { path: '', redirectTo: 'users', pathMatch: 'full' },
    ]
  },

  // Wildcard route for unknown paths
  // { path: '**', redirectTo: 'login' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes), // Add routing to the application
    provideStore({ 
      [authFeatureKey]: authReducer , 
      [userFeatureKey]: userReducer, 
      [categoryFeatureKey]: categoryReducer, 
      [productFeatureKey]: productReducer,
      [cartFeatureKey]: cartReducer
    
    }),
    provideEffects([AuthEffects, UserEffects, CategoryEffects, ProductEffects, CartEffects]),
    importProvidersFrom(
      BrowserAnimationsModule,
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: environment.production,
      })
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ],
}).catch(err => console.error(err));
