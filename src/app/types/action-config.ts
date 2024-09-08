import { ActionDisplayType } from './data-grid-config';
export interface Action {
  name: string;
  callback: (...args: any[]) => any;
  type: ActionType;
  enabled:  boolean;
  actionDisplayType?:ActionDisplayType
}
export enum ActionType {
  Single = 'SINGLE',
  Multi = 'MULTI',
}