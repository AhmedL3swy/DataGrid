export interface ColumnConfig {
  header: string;
  field: string;
  sortable?: boolean;
  isMultiLang?: boolean;
  multiField?: {
    [index: string]: string;
  };
}
