import {Component, computed, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account/account.service';
import { Account } from '../models/account.model';
import {AccountListComponent} from './account-list/account-list.component';
import {TransactionListComponent} from './transaction-list/transaction-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountListComponent, TransactionListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mainAccount: Account | null = null;
  isLoading = true;
  error: string | null = null;

  balanceClass = computed(() => {
    if (!this.mainAccount) return '';
    return this.mainAccount.balance >= 0 ?
      'text-green-600 dark:text-green-400' :
      'text-red-600 dark:text-red-400';
  });

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadMainAccount();
  }

  loadMainAccount(): void {
    this.isLoading = true;
    this.error = null;

    this.accountService.getAccounts().subscribe({
      next: (accounts) => {

        this.mainAccount = accounts.find(account => account.isMain) || null;
        this.isLoading = false;


        if (!this.mainAccount && accounts.length === 0) {
          this.createMainAccount();
        }
      },
      error: () => {
        this.error = 'Failed to load account information. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  createMainAccount(): void {
    const mainAccountData = {
      name: 'Main Account',
      description: 'Your primary account'
    };

    this.accountService.createAccount(mainAccountData).subscribe({
      next: (account) => {
        this.mainAccount = account;
      },
      error: () => {
        this.error = 'Failed to create main account. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
