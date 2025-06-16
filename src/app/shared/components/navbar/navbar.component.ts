import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { AuthMode } from '../../../features/models/auth.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UiStateService } from '../../../core/services/ui-state/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  faSun = faSun;
  faMoon = faMoon;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faSignOutAlt = faSignOutAlt;

  isAuthenticated$!: Observable<boolean>;
  authMode: AuthMode = 'login';

  private router = inject(Router);
  private alertService = inject(AlertService);
  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  private uiStateService = inject(UiStateService);

  showButtons$!: Observable<boolean>;
  ngOnInit(): void {
    this.showButtons$ = this.uiStateService.showButtons$;

    this.isAuthenticated$ = this.authService.userIdState$.pipe(
      map(token => !!token)
    );
    this.showButtons$.subscribe(show => {
      console.log('[NavbarComponent] showButtons$ value:', show);
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  login(): void {
    this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
  }

  register(): void {
    this.router.navigate(['/auth'], { queryParams: { mode: 'register' } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']).then(r => this.alertService.showAlert('You have been logged out', true));
  }
}
