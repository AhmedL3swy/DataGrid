import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GridStateService {
  constructor() {}

  State: Set<any> = new Set<any>();
  SaveState(state: Set<any>): void {
    this.State = state;
  }
  GetState(): Set<any> {
    return this.State;
  }
  ClearState(): void {
    this.State.clear();
  }
}
