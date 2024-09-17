import { Action } from './action-config';
import { ColumnConfig } from './column-config';
export interface DataGridConfig {
  dataApi: string;

  apiInputkeyWords?: {
    page?: string;
    pageSize?: string;
    sort?: string;
    order?: string;
    search?: string;
  };

  apiResultKeyWords?: {
    data?: string;
    total?: string;
  };

  pageSizeOptions?: number[];
  columns: ColumnConfig[];
  uniqueKey?: string;
  actions?: Action[];
  singleActionDisplay?: ActionDisplayType;
}

export enum ActionDisplayType {
  ROW = 'ROW',
  HEADER = 'HEADER',
}
export interface GridState {
  displayedData: any[];
  total: number;
  pageSize: number;
  pageNumber: number;
  selectedEntity: any ;
  multiEntity: any[];
  multiMode: boolean;
  sortDirection: string;
  currentSortColumn: string;
  uniqueKey: string;
  isEmpty: boolean;
  isLoading: boolean;
  language: string;
  searchValue: string;
  displayType: ActionDisplayType;
}


export interface RangeSearch {
  field: string;
  start: string;
  end: string;
}
export interface NestedSearch {
  relativePath: string;
  value: string;
}
export type PaginatorOptions = number[];
