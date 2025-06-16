import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../../features/models/auth.model';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5297/';

  private router = inject(Router);
  private http = inject(HttpClient);
  private alert = inject(AlertService);

  private userIdSubject = new BehaviorSubject<string>(
    this.getStoredToken() || '',
  );

  userIdState$ = this.userIdSubject.asObservable();

  login(loginCredentials: Auth): Observable<any> {
    return this.http.post(this.apiUrl + 'api/users/login', loginCredentials).pipe(
      map((Response: any) => {
        this.alert.showAlert('User has been logged in', true);
        this.setToken(Response.token);
        this.router.navigateByUrl('/home');
      }),
      catchError((err) => this.errorHandler(err)),
    );
  }

  register(registerCredentials: Auth): Observable<any> {
    return this.http.post(this.apiUrl + 'api/users/register', registerCredentials).pipe(
      map((Response) => {
        this.alert.showAlert('User has been registered', true);
        this.router.navigateByUrl('/');
        return true;
      }),
      catchError((err) => this.errorHandler(err)),
    );
  }

  logout() {
    this.userIdSubject.next('');
    this.router.navigateByUrl('');
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    this.userIdSubject.next(token);
    localStorage.setItem('token', token);
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  errorHandler(err: any): Observable<any> {
    if (err.status === 0) {
      this.alert.showAlert('Server not accessible', false);
    } else if (err.status === 400) {
      this.alert.showAlert('Invalid credentials, please try again', false);
    } else if (err.status === 401) {
      this.alert.showAlert('Unauthorized, please log in again', false);
    } else if (err.status === 409) {
      this.alert.showAlert('User with this email already exists. Please use a different email or try logging in.', false);
    } else if (err.status >= 500) {
      this.alert.showAlert('Server error, please try again later', false);
    }
    return EMPTY;
  }
}
