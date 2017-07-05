import IUser from '../api/account/interfaces/IUser';
import IPlace from '../api/place/interfaces/IPlace';
import {IAppStore} from './app/IAppStore';

export interface IStore {
  routing: any;
  places: IPlace[];
  accounts: IUser[];
  app: IAppStore;
  reduxAsyncConnect: any;
}
