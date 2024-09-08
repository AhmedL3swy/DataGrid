import { Component } from '@angular/core';
import { DataGridConfig } from '../../types/data-grid-config';
import { ActionType } from '../../types/action-config';
import { DataGridComponent } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridContainerComponent {
  
  isAdmin() {
    return true;
  }
  edit(entity: any) {
    alert('edit' + JSON.stringify(entity));
  }
  delete(entity: any) {
    alert('delete logic' + JSON.stringify(entity));
  }
  bulkDelete(entities: any[]) {
    alert('bulk delete logic' + JSON.stringify(entities));
    console.log(entities);
  }

  dataGird: DataGridConfig = {
    dataApi: 'https://dummyjson.com/products/search',
    columns: [
      {
        header: 'headers.Title',
        field: 'title',
        sortable: true,
        isMultiLang: true,
      },
      {
        header: 'headers.Price',
        field: 'price',
      },
    ],
    apiInputkeyWords: {
      page: 'skip',
      pageSize: 'limit',
      sort: 'sortBy',
      order: 'order',
      search: 'q',
    },
    apiResultKeyWords: {
      data: 'products',
      total: 'total',
    },
    pageSizeOptions: [7, 10, 15],
    actions: [
      {
        name: 'buttons.Edit',
        callback: (entity) => this.edit(entity),
        enabled: this.isAdmin(),
        type: ActionType.Single,
      },
      {
        name: 'buttons.Delete',
        callback: (entity) => this.delete(entity),
        enabled: this.isAdmin(),
        type: ActionType.Single,
      },
      {
        name: 'buttons.BDelete',
        callback: (entities) => this.bulkDelete(entities),
        enabled: this.isAdmin(),
        type: ActionType.Multi,
      },
    ],
    uniqueKey: 'id',
    
  };
}
