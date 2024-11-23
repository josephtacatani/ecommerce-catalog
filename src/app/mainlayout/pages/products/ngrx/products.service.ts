import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest, ProductResponse } from './products.models';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`; // Endpoint for fetching products
  private createUpdateUrl = `${environment.apiUrl}/products`; // Endpoint for create, update, delete

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   * @returns Observable<ProductResponse>
   */
  getProducts(): Observable<ProductResponse> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    return this.http.get<ProductResponse>(this.apiUrl, { headers });
  }

  /**
   * Create a new product
   * @param productData Data for creating a new product
   * @returns Observable<Product>
   */
  createProduct(productData: ProductRequest): Observable<Product> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.post<Product>(this.apiUrl, productData, { headers });
  }

  /**
   * Update an existing product
   * @param productId ID of the product to update
   * @param productData Updated product data
   * @returns Observable<Product>
   */
  updateProduct(productId: string, productData: ProductRequest): Observable<Product> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.put<Product>(`${this.createUpdateUrl}/${productId}`, productData, { headers });
  }

  /**
   * Delete a product by ID
   * @param productId ID of the product to delete
   * @returns Observable<{ message: string }>
   */
  deleteProduct(productId: string): Observable<{ message: string }> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.delete<{ message: string }>(`${this.createUpdateUrl}/${productId}`, { headers });
  }
}
