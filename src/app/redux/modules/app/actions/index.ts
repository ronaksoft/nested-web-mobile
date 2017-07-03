import {} from '../IAppStore';
import * as ActionTypes from './types';
import IUser from '../../../../api/account/interfaces/IUser';

export function userAdd(user: IUser): IAccountAction {
  return {
    type: ActionTypes.ACCOUNT_ADD,
    payload: user,
  };
}

export function userUpdate(user: IUser): IAccountAction {
  return {
    type: ActionTypes.ACCOUNT_UPDATE,
    payload: user,
  };
}
