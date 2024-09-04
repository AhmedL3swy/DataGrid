import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from './Components/data-grid/data-grid.component';
import { DataGridConfig } from './types/data-grid-config';
import { json } from 'stream/consumers';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DataGrid';

  dataGird: DataGridConfig = {
    columns: [
      { name: 'Name', field: 'name', sortable: true, searchable: true },
      { name: 'Age', field: 'age', sortable: true, searchable: true },
    ],
    data: [
      { bname: 'Ahmed', age: 16 },
      { name: 'bAxhmed', age: 17 },
      { name: 'xAhmed', age: 15 },
      { name: 'rAhmed', age: 11 },
      { name: 'yAhmed', age: 14 },
      { name: 'zAhmed', age: 16 },
      { name: 'hAhmed7', age: 17 },
      { name: 'nAhmed8', age: 14 },
      { name: 'tAhmed9', age: 181 },
      { name: 'fAhmed10', age: 14 },
      { name: 'wAhmed11', age: 12 },
      { name: 'wAhmed12', age: 14 },
      { name: 'wXD', age: 16 },
    ],
    actions: [
      {
        name: 'Edit',
        callback: (entity, arg1 = 1, arg2 = 2) =>
        alert('edit' + JSON.stringify(entity)),
        roles: ['User'],
        type: 'single',
      },
      {
        name: 'Delete',
        callback: (entity) => alert('delete logic' +JSON.stringify(entity)),
        roles: ['Admin'],
        type: 'single',    
      },
      {
        name: 'Bulk Delete',
        callback: (entities) => {alert('bulk delete logic' + JSON.stringify(entities))
           console.log(entities)},
        roles: ['Admin'],
        type: 'multi',
      },
    ],
  };
}
