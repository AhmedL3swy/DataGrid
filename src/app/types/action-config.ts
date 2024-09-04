export interface Action {
  name: string;
  callback: (...args: any[]) => any;
  roles: string[];
  type: string;
}
