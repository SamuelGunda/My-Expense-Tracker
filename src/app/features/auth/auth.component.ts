import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignInAlt, faUserPlus, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { AlertService } from '../../core/services/alert/alert.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Auth, AuthMode } from '../models/auth.model';
import { AuthFormsService } from '../../core/services/auth/auth-forms.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  mode: AuthMode = 'login';

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  formSubmitted = false;

  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faArrowLeft = faArrowLeft;

  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected authFormsService = inject(AuthFormsService);

  private returnUrl = '/home';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] && (params['mode'] === 'login' || params['mode'] === 'register')) {
        this.mode = params['mode'];
      }

      this.returnUrl = params['returnUrl'] || '/home';
    });
    this.initForms();
  }

  private initForms(): void {
    this.loginForm = this.authFormsService.createLoginForm();
    this.registerForm = this.authFormsService.createRegisterForm();
  }

  get activeForm(): FormGroup {
    return this.mode === 'login' ? this.loginForm : this.registerForm;
  }

  get emailControl(): AbstractControl | null {
    return this.activeForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.activeForm.get('password');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (!this.activeForm.valid) {
      this.alertService.showAlert('Please correct the form errors.', false);
      return;
    }

    const formValue = this.activeForm.value;
    const credentials: Auth = {
      email: formValue.email,
      password: formValue.password
    };

    if (this.mode === 'login') {
      this.authService.login(credentials).subscribe({
        next: () => {
          this.alertService.showAlert('Login successful!', true);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => this.alertService.showAlert(err.error?.message || 'Login failed. Please check your credentials.', false)
      });
    } else {
      this.authService.register(credentials).subscribe({
        next: () => {
          this.alertService.showAlert('Registration successful! Please log in.', true);
          this.mode = 'login';
        },
        error: (err) => this.alertService.showAlert(err.error?.message || 'Registration failed. Please try again.', false)
      });
    }
  }

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.resetForms();
  }

  private resetForms(): void {
    this.formSubmitted = false;
    if (this.loginForm) {
      this.loginForm.reset();
    }
    if (this.registerForm) {
      this.registerForm.reset();
    }
  }
}
