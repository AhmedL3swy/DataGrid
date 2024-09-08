export interface Action {
  name: string;
  callback: (...args: any[]) => any;
  type: ActionType;
  enabled:  boolean;
}
export enum ActionType {
  Single = 'SINGLE',
  Multi = 'MULTI',
}