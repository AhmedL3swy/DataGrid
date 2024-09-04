import { Action } from "./action-config";
import { ColumnConfig } from "./column-config";

export interface DataGridConfig {
    uniqueId:string,
    columns: ColumnConfig[];
    data: any[];
    actions:Action[];
}
