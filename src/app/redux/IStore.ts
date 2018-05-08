import {IUser, IComment, IPlace} from 'api/interfaces';
import ITask from '../api/task/interfaces/ITask';
import {IAppStore} from './app/IAppStore';
import {IAttachmentStore} from './attachment/IAttachmentStore';

export interface IStore {
  places: IPlace[];
  accounts: IUser[];
  tasks: ITask[];
  comments: IComment[];
  app: IAppStore;
  attachments: IAttachmentStore;
  reduxAsyncConnect: any;
}
