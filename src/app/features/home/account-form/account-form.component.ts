import { Component, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from '../../../core/services/account/account.service';
import {CommonModule} from '@angular/common';
import {Account} from '../../models/account.model';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent {
  @Output() accountCreated = new EventEmitter<void>();

  accountForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    // Use Partial<Account> instead of CreateUpdateAccountRequest
    const accountData: Partial<Account> = this.accountForm.value;

    this.accountService.createAccount(accountData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.accountForm.reset();
        this.accountCreated.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Failed to create account. Please try again.';
      }
    });
  }
}
