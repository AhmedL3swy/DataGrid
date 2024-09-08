import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataGridService {
  constructor() {}

  resetSignal = new Subject<boolean>();

  emitResetSingal() {
    this.resetSignal.next(true);
  }

  resetPagSignal = new Subject<boolean>();

  emitResetPagSingal(){
    this.resetPagSignal.next(true);
  }
}
