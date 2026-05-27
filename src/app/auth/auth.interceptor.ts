import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * HTTP interceptor that:
 * 1. Adds JWT token from localStorage to all requests
 * 2. Handles 401 responses by clearing auth state and redirecting to /login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Add Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // On 401, clear auth state and redirect to login
      if (err.status === 401) {
        console.warn('Received 401 Unauthorized — clearing auth and redirecting to /login');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        inject(Router).navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

