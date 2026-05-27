import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BingoService } from '../services/bingo.service';
import { LoginRequest, LoginResponse } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BingoService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_ID_KEY = 'userId';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    super();
  }

  /**
   * Login with username and password.
   * Stores token and userId in localStorage on success.
   */
  login(req: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.URL}/auth/login`, req)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_ID_KEY, response.userId);
        }),
        map(() => void 0)
      );
  }

  /**
   * Stub login for offline development (until BingoServer has the endpoint).
   * Generates a fake JWT token and stores it.
   */
  stubLogin(username: string): void {
    const fakeToken = btoa(`${username}:fake-token-${Date.now()}`);
    const fakeUserId = `user-${Date.now()}`;
    localStorage.setItem(this.TOKEN_KEY, fakeToken);
    localStorage.setItem(this.USER_ID_KEY, fakeUserId);
  }

  /**
   * Check if user is currently logged in (token exists).
   */
  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  /**
   * Get stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user ID.
   */
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  /**
   * Logout: clear localStorage and navigate to login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    this.router.navigate(['/login']);
  }
}



