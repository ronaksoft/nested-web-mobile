import {IAccountAction} from '../IAccountStore';
import * as ActionTypes from './types';
import {IUser} from 'api/interfaces';

export function accountAdd(user: IUser): IAccountAction {
  return {
    type: ActionTypes.ACCOUNT_ADD,
    payload: user,
  };
}

export function accountUpdate(user: IUser): IAccountAction {
  return {
    type: ActionTypes.ACCOUNT_UPDATE,
    payload: user,
  };
}
