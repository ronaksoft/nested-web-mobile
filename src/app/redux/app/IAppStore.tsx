import IUser from '../../api/account/interfaces/IUser';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  placesUnseenCounters: any[];
}

export interface IAppAction {
  type: string;
  payload?: IUser | boolean;
}
