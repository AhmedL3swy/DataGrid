import { Component } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { DataGridComponent } from "../data-grid/data-grid.component";

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  dataGird: DataGridConfig = {
    uniqueId:"id",
    columns: [
      { name: 'Name', field: 'name', sortable: true, searchable: true },
      { name: 'Age', field: 'age', sortable: true, searchable: true },
    ],
    data: [
      { id:1, name: 'Ahmed', age: 16 },
      { id:2, name: 'bAxhmed', age: 17 },
      { id:3, name: 'xAhmed', age: 15 },
      { id:4, name: 'nAhmed', age: 15 },
      { id:5, name: 'tAhmed', age: 15 },
      { id:6, name: 'zxAhmed', age: 15 },
      { id:7, name: 'oxAhmed', age: 15 },
      { id:8, name: 'xAhmed', age: 15 },
      { id:9, name: 'yxAhmed', age: 15 },
      { id:10, name: 'lxAhmed', age: 15 },
      { id:11, name: 'mxAhmed', age: 15 },

    ],
    actions: [
      {
        name: 'Edit',
        callback: (entity, arg1 = 1, arg2 = 2) =>
          alert('edit' + JSON.stringify(entity)),
        roles: ['User','Admin'],
        type: 'single',
      },
      {
        name: 'Delete',
        callback: (entity) => alert('delete logic' + JSON.stringify(entity)),
        roles: ['Admin'],
        type: 'single',
      },
      {
        name: 'Bulk Delete',
        callback: (entities) => {
          alert('bulk delete logic' + JSON.stringify(entities));
          console.log(entities);
        },
        roles: ['Admin'],
        type: 'multi',
      },
      
    ],
  };
}
