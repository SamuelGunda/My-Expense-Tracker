import { Injectable, inject } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthFormsService {
  private fb = inject(FormBuilder);

  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  shouldShowError(control: AbstractControl | null, formSubmitted: boolean): boolean {
    if (!control) return false;
    return formSubmitted || control.dirty;
  }

  hasError(control: AbstractControl | null, errorName: string, formSubmitted: boolean): boolean {
    if (!control) return false;
    return control.hasError(errorName) && this.shouldShowError(control, formSubmitted);
  }

  hasPasswordMismatchError(form: FormGroup | null, formSubmitted: boolean): boolean {
    if (!form) return false;
    return form.hasError('passwordMismatch') && formSubmitted;
  }
}
