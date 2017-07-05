import {} from '../IAppStore';
import * as ActionTypes from './types';
import IUser from '../../../api/account/interfaces/IUser';
import {IAppAction} from '../IAppStore';

export function userSet(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_SET,
    payload: user,
  };
}

export function userUpdate(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_UPDATE,
    payload: user,
  };
}

export function userUnset(): IAppAction {
  return {
    type: ActionTypes.APP_USER_UNSET,
  };
}

export function login(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_LOGIN,
    payload: user,
  };
}

export function logout(): IAppAction {
  return {
    type: ActionTypes.APP_LOGOUT,
  };
}

export function setNotification(notifications: any[]): IAppAction {
  return {
    type: ActionTypes.APP_NOTIFICATION_SET,
    payload: notifications,
  };
}

export function unsetNotification(notifications: any[]): IAppAction {
  return {
    type: ActionTypes.APP_NOTIFICATION_SET,
    payload: notifications,
  };
}
