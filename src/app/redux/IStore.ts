import IUser from '../api/account/interfaces/IUser';
import IPlace from '../api/place/interfaces/IPlace';
import {IAppStore} from './app/IAppStore';
import IComment from '../api/comment/interfaces/IComment';
import IPost from '../api/post/interfaces/IPost';

export interface IStore {
  routing: any;
  places: IPlace[];
  accounts: IUser[];
  comments: IComment[];
  posts: IPost[];
  app: IAppStore;
  reduxAsyncConnect: any;
}
