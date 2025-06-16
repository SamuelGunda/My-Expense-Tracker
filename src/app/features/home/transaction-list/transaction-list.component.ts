import {Component, Input, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {TransactionService} from '../../../core/services/transaction/transaction.service';
import {Transaction} from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  @Input() title = 'Transactions';
  @Input() showViewAll = false;
  @Input() accountId?: number;

  transactions: Transaction[] = [];
  allTransactions: Transaction[] = [];
  isLoading = true;
  isLoadingAll = false;
  error: string | null = null;

  // selectedTransaction: Transaction | null = null;
  // showDescriptionModal = false;
  // showAllTransactionsModal = false;

  selectedTransaction = signal<Transaction | null>(null);
  showDescriptionModal = signal(false);
  showAllTransactionsModal = signal(false);

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;

    const request = this.accountId
      ? this.transactionService.getAccountTransactions(this.accountId)
      : this.transactionService.getRecentTransactions();

    request.subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  openDescriptionModal(transaction: Transaction): void {
    if (this.showAllTransactionsModal()) {

      this.showAllTransactionsModal.set(false);
      this.selectedTransaction.set(transaction);

      setTimeout(() => {
        this.showDescriptionModal.set(true);
      }, 100);
    } else {
      this.selectedTransaction.set(transaction);
      this.showDescriptionModal.set(true);
    }
  }

  closeDescriptionModal(): void {
    this.showDescriptionModal.set(false);

    if (this.selectedTransaction() && !this.showAllTransactionsModal()) {
      setTimeout(() => {
        this.showAllTransactionsModal.set(true);
        this.selectedTransaction.set(null);
      }, 100);
    } else {
      this.selectedTransaction.set(null);
    }
  }

  openAllTransactionsModal(): void {
    this.showAllTransactionsModal.set(true);
    this.loadAllTransactions();
  }

  closeAllTransactionsModal(): void {
    this.showAllTransactionsModal.set(false);
  }

  loadAllTransactions(): void {
    this.isLoadingAll = true;

    const request = this.accountId
      ? this.transactionService.getAccountTransactions(this.accountId)
      : this.transactionService.getUserTransactions();

    request.subscribe({
      next: (transactions) => {
        this.allTransactions = transactions;
        this.isLoadingAll = false;
      },
      error: (error) => {
        this.error = 'Failed to load all transactions';
        this.isLoadingAll = false;
      }
    });
  }
}
