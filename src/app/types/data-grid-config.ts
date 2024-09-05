import { Action } from './action-config';
import { ColumnConfig } from './column-config';
export interface DataGridConfig {
    dataApi: string;
    apiInputkeyWords: {
    page: string;
    pageSize: string;
    sort: string;
    order: string;
    search: string;
  };
  apiResultKeyWords: {
    data: string;
    total: string;
  };

  pageSizeOptions: number[];
  columns: ColumnConfig[];

  uniqueKey: string;
  actions: Action[];
}
