import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token: string | null = null;
  private apiUrl = `${environment.apiUrl}/auth`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      // If token is found in sessionStorage, set it and update authentication status
      this.token = token;
      this.isAuthenticatedSubject.next(true);
    } else {
      // Trigger token fetch if not found in sessionStorage
      this.fetchToken().subscribe();
    }
  }

  // Fetch token from the API and store it in sessionStorage
  fetchToken(): Observable<{ token: string }> {
    // Return the observable from the HTTP request
    // This allows the caller to subscribe to it and handle the response
    return this.http.get<{ token: string }>(`${this.apiUrl}/`).pipe(
      // Use tap operator to perform side effects
      // such as storing the token in sessionStorage, updating internal state and notifying
      tap(data => {
        this.token = data.token;
        sessionStorage.setItem('token', data.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  getToken(): string | null {
    // Return the token if it exists, otherwise return null
    return this.token;
  }

  // Verify the token with the server
  verifyToken(): void {
    // Check if the token is available before making the request
    if (!this.token) {
      this.isAuthenticatedSubject.next(false);
      return;
    }

    // Make a POST request to verify the token
    this.http
      // Expect the response to be an object with a message and authenticated status
      // Pass the token in the request body
      .post<{ message: string; authenticated: boolean }>(`${this.apiUrl}/verify`, { token: this.token })
      .subscribe({
        // Handle the response from the server by updating the authentication status
        next: data => {
          this.isAuthenticatedSubject.next(data.authenticated);
        },
        // Handle errors by logging them and updating the authentication status
        error: error => {
          console.error('Error verifying token:', error);
          this.isAuthenticatedSubject.next(false);
          this.token = null;
          sessionStorage.removeItem('token');
        },
      });
  }
}
