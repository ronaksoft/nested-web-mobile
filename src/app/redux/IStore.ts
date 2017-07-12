import IUser from '../api/account/interfaces/IUser';
import IPlace from '../api/place/interfaces/IPlace';
import {IAppStore} from './app/IAppStore';
import IComment from '../api/comment/interfaces/IComment';

export interface IStore {
  routing: any;
  places: IPlace[];
  accounts: IUser[];
  comments: IComment[];
  app: IAppStore;
  reduxAsyncConnect: any;
}
