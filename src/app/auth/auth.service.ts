import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { AuthRequestInterface, AuthResponseInterface, ChangePasswordRequestInterface, ChangePasswordResponseInterface, ForgotPasswordRequestInterface, ForgotPasswordResponseInterface, RegisterRequestInterface, RegisterResponseInterface } from '../core/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a login request with the required headers and payload.
   * @param credentials - The user's login credentials
   * @returns Observable with the response containing the authentication token and user info.
   */
  login(credentials: AuthRequestInterface): Observable<AuthResponseInterface> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Set the X-Request-ID header as required
    });

    return this.http.post<AuthResponseInterface>(`${this.apiUrl}/login`, credentials, { headers });
  }

  /**
   * Sends a register request with the required headers and payload.
   * @param data - The user's registration data
   * @returns Observable with the response containing the registration status.
   */
  register(data: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Group tag identifier
    });
    return this.http.post<RegisterResponseInterface>(`${this.apiUrl}/register`, data, { headers });
  }

  verifyusername(data: ForgotPasswordRequestInterface): Observable<ForgotPasswordResponseInterface> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Group tag identifier
    });
    return this.http.post<ForgotPasswordResponseInterface>(`${this.apiUrl}/verify-username`, data, { headers });
  }

  
  chnagePassword(data: ChangePasswordRequestInterface): Observable<ChangePasswordResponseInterface> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Request-ID': '1', // Group tag identifier
    });
    return this.http.post<ChangePasswordResponseInterface>(`${this.apiUrl}/reset-password`, data, { headers });
  }

  /**
   * Sends a logout request with the required headers and token.
   * @returns Observable with the logout response.
   */
  logout(): Observable<any> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    // Set headers with the Authorization token and X-Request-ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include the token as a Bearer token
      'X-Request-ID': '1', // Include the required X-Request-ID header
    });

    // Send the logout request with the headers
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }
}
