import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from '../../../core/services/alert/alert.service';
import { Alert } from '../../../features/models/alert.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-30px)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in'))
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: Alert = {
    isShown: false,
    message: '',
    status: false
  };

  // Font Awesome icons
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;

  private subscription: Subscription = new Subscription();

  constructor(
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.alertService.alert$.subscribe(alert => {
        this.alert = alert;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeAlert(): void {
    this.alertService.removeAlert();
  }
}
