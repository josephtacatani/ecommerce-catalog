import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import {
  Categories,
  CategoryRequestInterface,
  CategoryResponseInterface,
} from './categories.model';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`; // Endpoint for fetching categories
  private createUpdateUrl = `${environment.apiUrl}/category`; // Endpoint for create, update, delete

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   * @returns Observable<CategoryResponseInterface>
   */
  getCategories(): Observable<CategoryResponseInterface> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    return this.http.get<CategoryResponseInterface>(this.apiUrl, { headers });
  }
  

  /**
   * Create a new category
   * @param categoryData Data for creating a new category
   * @returns Observable<Categories>
   */
  createCategory(categoryData: CategoryRequestInterface): Observable<Categories> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.post<Categories>(this.createUpdateUrl, categoryData, { headers });
  }

  /**
   * Update an existing category
   * @param categoryId ID of the category to update
   * @param categoryData Updated category data
   * @returns Observable<Categories>
   */
  updateCategory(categoryId: string, categoryData: CategoryRequestInterface): Observable<Categories> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.put<Categories>(`${this.createUpdateUrl}/${categoryId}`, categoryData, { headers });
  }

  /**
   * Delete a category by ID
   * @param categoryId ID of the category to delete
   * @returns Observable<{ message: string }>
   */
  deleteCategory(categoryId: string): Observable<{ message: string }> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-Request-ID': '1',
    });
    return this.http.delete<{ message: string }>(`${this.createUpdateUrl}/${categoryId}`, { headers });
  }
}
