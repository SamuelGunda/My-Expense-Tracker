import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  private _showButtons = new BehaviorSubject<boolean>(true);
  showButtons$ = this._showButtons.asObservable();

  setShowButtons(value: boolean) {
    this._showButtons.next(value);
  }
}
