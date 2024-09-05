import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getData(apiUrl: string, params: HttpParams) {
    console.log(`${apiUrl}?${params.toString()}`);
    return this.httpClient.get(apiUrl, { params: params });
  }
}
