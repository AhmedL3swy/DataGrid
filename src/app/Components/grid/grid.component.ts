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
  currentLocale() {
    return 'en';
  }
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
    dataApi: 'https://dummyjson.com/products',
    columns: [
      {
        display: { en: 'Dtitle', ar: 'الاسم' },
        field: { en: 'title', ar: 'الاسم' },
        SortKeyWord: 'title',
      },
      {
        display: { en: 'Dprice', ar: 'السعر' },
        field: { en: 'price', ar: 'السعر' },
      },
    ],
    currentLocale: this.currentLocale(),
    apiInputkeyWords: {
      page: 'skip',
      pageSize: 'limit',
      sort: 'sortBy',
      order: 'order',
      search: 'search',
    },
    apiResultKeyWords: {
      data: 'products',
      total: 'total',
    },
    pageSizeOptions: [5, 10, 15],
    actions: [
      {
        name: 'Edit',
        callback: (entity) => this.edit(entity),
        enabled: () => this.isAdmin(),
        type: ActionType.Single,
      },
      {
        name: 'Delete',
        callback: (entity) => this.delete(entity),
        enabled: () => this.isAdmin(),
        type: ActionType.Single,
      },
      {
        name: 'Bulk Delete',
        callback: (entities) => this.bulkDelete(entities),
        enabled: () => this.isAdmin(),
        type: ActionType.Multi,
      },
    ],
    uniqueKey: 'id',
  };
}
