import {IUser} from 'api/interfaces';

export interface IAccountStore {
  accounts: IUser[];
}

export interface IAccountAction {
  type: string;
  payload?: IUser;
}
