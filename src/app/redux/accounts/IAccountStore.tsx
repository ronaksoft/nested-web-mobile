import IUser from '../../api/account/interfaces/IUser';

export interface IAccountStore {
  accounts: IUser[];
}

export interface IAccountAction {
  type: string;
  payload?: IUser;
}
