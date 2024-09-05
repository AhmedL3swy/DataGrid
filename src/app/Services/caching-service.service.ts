import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  constructor() { }
  dataGridSate : {
    multiMode: boolean,
    multiEntity: any[] ,
  } 
  = {
    multiMode: false,
    multiEntity: [],
  };

}
