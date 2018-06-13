import {ILabel, IPlace, IUser} from 'api/interfaces/';

interface INotification {
  _id: string;
  type: number;
  read: boolean;
  timestamp?: number;
  comment_id?: string;
  comment?: any;
  post_id?: string;
  post?: any;
  actor_id?: string;
  actor?: IUser;
  account_id?: string;
  account?: IUser;
  data?: any;
  place_id?: string;
  place?: IPlace;
  invite_id?: string;
  others?: any;
  label_id?: string;
  label?: ILabel;
  task_id?: string;
  client_id?: string;
}

export default INotification;
