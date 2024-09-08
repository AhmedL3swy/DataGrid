import { ApiService } from './../../Services/fake-data-service.service';
import { Component } from '@angular/core';
import {
  ActionDisplayType,
  DataGridConfig,
} from '../../types/data-grid-config';
import { ActionType } from '../../types/action-config';
import { DataGridComponent } from '../data-grid/data-grid.component';
import { DataGridService } from '../../Services/data-grid.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridContainerComponent {
  constructor(
    private dataGridService: DataGridService,
    private ApiService: ApiService
  ) {}
  resetGrid() {
    this.dataGridService.emitResetSingal();
  }
  isAdmin() {
    return true;
  }
  edit(entity: any) {
    alert('edit' + JSON.stringify(entity));
  }
  delete(entity: any) {
    this.ApiService.deleteEntity(
      'https://dummyjson.com/products',
      entity.id
    ).subscribe((res) => {
      console.log(res);
      this.resetGrid();
    });
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
        actionDisplayType: ActionDisplayType.ROW,
      },
      {
        name: 'buttons.Delete',
        callback: (entity) => this.delete(entity),
        enabled: this.isAdmin(),
        type: ActionType.Single,
        actionDisplayType: ActionDisplayType.ROW,
      },
      {
        name: 'buttons.BDelete',
        callback: (entities) => this.bulkDelete(entities),
        enabled: this.isAdmin(),
        type: ActionType.Multi,
      },
    ],
    uniqueKey: 'id',
    // singleActionDisplay: ActionDisplayType.ROW,
  };
}
