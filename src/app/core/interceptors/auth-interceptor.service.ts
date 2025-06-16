import {inject, Injectable} from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpEvent, HttpRequest } from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getStoredToken();

    if (token) {
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            localStorage.removeItem('token');

            window.location.href = '/';
            return EMPTY;
          }
        }
        return throwError(err);
      })
    )
  }
}
