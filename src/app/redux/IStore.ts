import IUser from '../api/account/interfaces/IUser';
import IPlace from '../api/place/interfaces/IPlace';
import {IAppStore} from './app/IAppStore';

export interface IStore {
  places: IPlace;
  accounts: IUser[];
  user: IUser;
  app: IAppStore;
  reduxAsyncConnect: any;
}
