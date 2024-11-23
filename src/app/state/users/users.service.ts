import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CreateUserRequest, CreateUserResponse, DeleteUserResponse, GetLoggedUserResponse, GetUsersResponse, UpdateUserRequest, User } from 'src/app/core/user.model';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private updateUrl = `${environment.apiUrl}/user`;
  private deleteteUrl = `${environment.apiUrl}/user`;
  private addUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<GetUsersResponse> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });
    const url = `${this.apiUrl}`;
    console.log('Requesting GET:', url); // Log the URL to verify
    return this.http.get<GetUsersResponse>(url, { headers });
  }

  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });
    return this.http.post<CreateUserResponse>(`${this.addUrl}`, userData, { headers });
  }

  updateUser(userId: string, userData: UpdateUserRequest): Observable<User> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });
    return this.http.put<User>(`${this.updateUrl}/${userId}`, userData, { headers });
  }

  deleteUser(userId: string): Observable<DeleteUserResponse> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });
    return this.http.delete<DeleteUserResponse>(`${this.deleteteUrl}/${userId}`, { headers });
  }

  getLoggedUser(): Observable<GetLoggedUserResponse> {
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });
    const url = this.addUrl;
    return this.http.get<GetLoggedUserResponse>(url, { headers });
  }

  
}
