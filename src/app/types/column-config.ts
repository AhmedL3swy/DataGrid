export interface ColumnConfig {
  header: string;
  field: {
    [index: string]: string;
  };
  SortKeyWord?: string;
}
