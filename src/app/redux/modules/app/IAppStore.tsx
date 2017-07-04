import IUser from '../../../api/account/interfaces/IUser';

export interface IAppStore {
  isSocketLogin: boolean;
  isLogin: boolean;
  user: IUser;
  userPlaces: string[];
  placesUnseenCounters
}

export interface IUserAction {
  type: string;
  payload: IUser;
}
