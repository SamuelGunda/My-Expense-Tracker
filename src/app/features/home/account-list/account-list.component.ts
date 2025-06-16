import {Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { Account } from '../../models/account.model';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, AccountFormComponent],
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  isLoading = false;
  error: string | null = null;

  showCreateAccountModal = signal(false);

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.error = null;

    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load accounts. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteAccount(id: number): void {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: () => {
          this.error = 'Failed to delete account. Please try again.';
        }
      });
    }
  }

  openCreateAccountModal(): void {
    this.showCreateAccountModal.set(true);
  }

  closeCreateAccountModal(): void {
    this.showCreateAccountModal.set(false);
  }

  onAccountCreated(): void {
    this.closeCreateAccountModal();
    this.loadAccounts();
  }
}
