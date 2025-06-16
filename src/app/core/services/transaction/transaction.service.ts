import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Transaction} from '../../../features/models/transaction.model';
import {RetryUtility} from '../../utils/retry.utility';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5297/api/transactions';

  private http = inject(HttpClient);

  getUserTransactions(): Observable<Transaction[]> {
    return RetryUtility.withRetry(
      this.http.get<Transaction[]>(this.apiUrl)
    );
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return RetryUtility.withRetry(
      this.http.get<Transaction[]>(`${this.apiUrl}/recent`)
    );
  }

  createDeposit(requestData: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/deposit`, requestData);
  }

  createWithdrawal(requestData: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/withdrawal`, requestData);
  }

  createTransfer(requestData: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transfer`, requestData);
  }

  getAccountTransactions(accountId: number): Observable<Transaction[]> {
    return RetryUtility.withRetry(
      this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`)
    );
  }
}
