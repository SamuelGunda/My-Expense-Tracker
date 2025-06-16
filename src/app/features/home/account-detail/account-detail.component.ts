import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account/account.service';
import { Account } from '../../models/account.model';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TransactionListComponent],
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  accountId: number = 0;
  account: Account | null = null;
  editForm: FormGroup;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id']; // Convert to number
      this.loadAccount();
    });
  }

  loadAccount(): void {
    this.isLoading = true;
    this.error = null;

    this.accountService.getAccount(this.accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
        this.setupForm();
      },
      error: (err) => {
        this.error = 'Failed to load account details. Please try again later.';
        this.isLoading = false;
        console.error();
      }
    });
  }

  setupForm(): void {
    if (this.account) {
      this.editForm.patchValue({
        name: this.account.name,
        description: this.account.description || ''
      });
    }
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.setupForm();
  }

  saveChanges(): void {
    if (this.editForm.invalid || this.isSaving || !this.account) {
      return;
    }

    this.isSaving = true;
    const accountData: Partial<Account> = this.editForm.value;

    this.accountService.updateAccount(this.accountId, accountData).subscribe({
      next: (updatedAccount) => {
        this.account = updatedAccount;
        this.isEditing = false;
        this.isSaving = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update account. Please try again.';
        this.isSaving = false;
      }
    });
  }

  deleteAccount(): void {
    if (!this.account || this.account.isMain) {
      return;
    }

    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(this.accountId).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          this.error = 'Failed to delete account. Please try again.';
        }
      });
    }
  }
}
