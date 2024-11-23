import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CartItem, CartResponse } from './cart.models';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private createUrl = `${environment.apiUrl}/cart/items`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch the user's cart.
   * @returns Observable<CartResponse>
   */
  getCart(): Observable<CartResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    return this.http.get<CartResponse>(this.apiUrl, { headers });
  }

  /**
   * Add an item to the cart.
   * @param cartItem Cart item to be added.
   * @returns Observable<{ message: string }>
   */
  addToCart(cartItem: CartItem): Observable<CartResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    

    return this.http.post<CartResponse>(this.createUrl, cartItem, { headers });
  }


  /**
   * Delete a specific item from the cart.
   * @param productName Name of the product to be deleted.
   * @returns Observable<{ message: string }>
   */
  deleteCartItem(cart_id: string): Observable<CartResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    const body = {
      cart_id, // Pass cart_id in the body as required by the backend
    };

    return this.http.delete<CartResponse>(`${this.apiUrl}/item`, { headers, body });
  }

  /**
   * Clear all items from the cart.
   * @returns Observable<{ message: string }>
   */
  clearCart(): Observable<{ message: string }> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    return this.http.delete<{ message: string }>(`${this.apiUrl}/clear`, { headers });
  }
}
