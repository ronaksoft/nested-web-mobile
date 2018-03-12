import IUser from '../api/account/interfaces/IUser';
import ITask from '../api/task/interfaces/ITask';
import IPlace from '../api/place/interfaces/IPlace';
import {IAppStore} from './app/IAppStore';
import IComment from '../api/comment/interfaces/IComment';

export interface IStore {
  places: IPlace[];
  accounts: IUser[];
  tasks: ITask[];
  comments: IComment[];
  app: IAppStore;
  reduxAsyncConnect: any;
}
