import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Alert } from '../../../features/models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private defaultTimeout = 4000;

  private alertSubject = new BehaviorSubject<Alert>({
    isShown: false,
    message: '',
    status: false,
  });

  get alert$(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }

  removeAlert(): void {
    this.alertSubject.next({
      isShown: false,
      message: '',
      status: false
    });
  }

  showAlert(message: string, status: boolean, timeout?: number): void {
    this.alertSubject.next({
      isShown: true,
      message,
      status
    });

    setTimeout(() => {
      this.removeAlert();
    }, timeout || this.defaultTimeout);
  }
}
