import { Injectable } from '@angular/core';
import { DataGridConfig } from '../types/data-grid-config';

@Injectable({
  providedIn: 'root',
})
export class FakeDataServiceService {
  constructor() {}
  
    data= [
      { id: 1, name: 'Ahmed', age: 16 },
      { id: 2, name: 'bAxhmed', age: 17 },
      { id: 3, name: 'xAhmed', age: 15 },
      { id: 4, name: 'nAhmed', age: 15 },
      { id: 5, name: 'tAhmed', age: 15 },
      { id: 6, name: 'zxAhmed', age: 15 },
      { id: 7, name: 'oxAhmed', age: 15 },
      { id: 8, name: 'xAhmed', age: 15 },
      { id: 9, name: 'yxAhmed', age: 15 },
      { id: 10, name: 'lxAhmed', age: 15 },
      { id: 11, name: 'mxAhmed', age: 15 },
    ]
  // Fake Pagination API
  GetPaginatedData(page: number, pageSize: number) {
    return this.data.slice((page - 1) * pageSize, pageSize * page);
  }
}
