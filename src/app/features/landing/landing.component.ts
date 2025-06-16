import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMoneyBillWave,
  faExchangeAlt,
  faFileInvoice,
  faStar as fasStar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, FontAwesomeModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  faMoneyBillWave = faMoneyBillWave;
  faExchangeAlt = faExchangeAlt;
  faFileInvoice = faFileInvoice;
  fasStar = fasStar;
  farStar = farStar;
}
