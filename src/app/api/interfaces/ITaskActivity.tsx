import {IUser, IAttachment} from 'api/interfaces';

interface ITaskActivity {
  _id: string;
  action: number;
  timestamp: number;
  actor_id?: string;
  actor?: IUser;
  editors?: IUser[];
  watchers?: IUser[];
  candidates?: IUser[];
  assignee?: IUser;
  attachments?: IAttachment[];
  title?: string;
  status?: number;
  todo_text?: string;
  comment_text?: string;
  due_date?: number;
  due_date_has_clock?: boolean;
}

export default ITaskActivity;