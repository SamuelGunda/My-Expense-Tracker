import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Account} from '../../../features/models/account.model';
import {RetryUtility} from '../../utils/retry.utility';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:5297/api/accounts';

  getAccounts(): Observable<Account[]> {
    return RetryUtility.withRetry(
      this.http.get<Account[]>(this.apiUrl)
    );
  }

  getAccount(id: number): Observable<Account> {
    return RetryUtility.withRetry(
      this.http.get<Account>(`${this.apiUrl}/${id}`)
    );
  }

  createAccount(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(id: number, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
