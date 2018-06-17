import {IUser, IAttachment, ILabel} from 'api/interfaces';

interface ITaskActivity {
  _id: string;
  task_id?: string;
  action: number;
  timestamp: number;
  actor_id?: string;
  actor?: IUser;
  editors?: IUser[];
  watchers?: IUser[];
  candidates?: IUser[];
  labels?: ILabel[];
  assignee?: IUser;
  attachments?: IAttachment[];
  title?: string;
  description?: string;
  status?: number;
  todo_text?: string;
  comment_text?: string;
  due_date?: number;
  due_data_has_clock?: boolean;
}

export default ITaskActivity;
