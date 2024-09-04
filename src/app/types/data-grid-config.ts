import { Action } from "./action-config";
import { ColumnConfig } from "./column-config";

export interface DataGridConfig {
    columns: ColumnConfig[];
    data: any[];
    actions:Action[];
}
