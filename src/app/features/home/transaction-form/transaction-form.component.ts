import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AccountService} from '../../../core/services/account/account.service';
import {AlertService} from '../../../core/services/alert/alert.service';
import {Account} from '../../models/account.model';
import {TransactionService} from '../../../core/services/transaction/transaction.service';
import {Transaction, TransactionType} from '../../models/transaction.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  accounts: Account[] = [];
  isSubmitting = false;
  transactionTypes = [TransactionType.Deposit, TransactionType.Withdrawal, TransactionType.Transfer];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      type: [TransactionType.Deposit, Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      sourceAccountId: [''],
      destinationAccountId: ['']
    });

    const typeControl = this.transactionForm.get('type');
    if (typeControl) {
      typeControl.valueChanges.subscribe((type: TransactionType) => {
        this.updateFormValidators(type);
      });
    }
  }

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: () => {
        this.alertService.showAlert('Failed to load accounts', false);
      }
    });

    const initialType = this.transactionForm.get('type')?.value;
    if (initialType) {
      this.updateFormValidators(initialType);
    }
  }

  updateFormValidators(type: TransactionType): void {
    const sourceAccountControl = this.transactionForm.get('sourceAccountId');
    const destinationAccountControl = this.transactionForm.get('destinationAccountId');

    sourceAccountControl?.clearValidators();
    destinationAccountControl?.clearValidators();

    switch (type) {
      case TransactionType.Deposit:
        destinationAccountControl?.setValidators([Validators.required]);
        break;
      case TransactionType.Withdrawal:
        sourceAccountControl?.setValidators([Validators.required]);
        break;
      case TransactionType.Transfer:
        sourceAccountControl?.setValidators([Validators.required]);
        destinationAccountControl?.setValidators([Validators.required]);
        break;
    }

    sourceAccountControl?.updateValueAndValidity();
    destinationAccountControl?.updateValueAndValidity();
  }

  showSourceAccount(): boolean {
    const type = this.transactionForm.get('type')?.value;
    return type === TransactionType.Withdrawal || type === TransactionType.Transfer;
  }

  showDestinationAccount(): boolean {
    const type = this.transactionForm.get('type')?.value;
    return type === TransactionType.Deposit || type === TransactionType.Transfer;
  }

  getFormTitle(): string {
    const type = this.transactionForm.get('type')?.value;
    return `Create ${type} Transaction`;
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      Object.keys(this.transactionForm.controls).forEach(key => {
        this.transactionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.transactionForm.value;
    formValue.sourceAccountId = parseInt(formValue.sourceAccountId) || null;
    formValue.destinationAccountId = parseInt(formValue.destinationAccountId) || null;
    const type = formValue.type;

    switch (type) {
      case TransactionType.Deposit:
        this.createDeposit(formValue);
        break;
      case TransactionType.Withdrawal:
        this.createWithdrawal(formValue);
        break;
      case TransactionType.Transfer:
        this.createTransfer(formValue);
        break;
      default:
        this.alertService.showAlert('Invalid transaction type', false);
        this.isSubmitting = false;
    }
  }

  private createDeposit(formValue: Transaction): void {
    this.transactionService.createDeposit(formValue).subscribe({
      next: () => this.handleSuccess('Deposit created successfully'),
      error: (error) => this.handleError('Failed to create deposit', error)
    });
  }

  private createWithdrawal(formValue: Transaction): void {
    this.transactionService.createWithdrawal(formValue).subscribe({
      next: () => this.handleSuccess('Withdrawal created successfully'),
      error: (error) => this.handleError('Failed to create withdrawal', error)
    });
  }

  private createTransfer(formValue: Transaction): void {
    this.transactionService.createTransfer(formValue).subscribe({
      next: () => this.handleSuccess('Transfer created successfully'),
      error: (error) => this.handleError('Failed to create transfer', error)
    });
  }

  private handleSuccess(message: string): void {
    this.isSubmitting = false;
    this.alertService.showAlert(message, true);
    this.router.navigate(['/home']);
  }

  private handleError(message: string, error: any): void {
    this.isSubmitting = false;
    this.alertService.showAlert(message, false);
  }
}
