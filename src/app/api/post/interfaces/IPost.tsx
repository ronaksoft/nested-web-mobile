import IPostCounters from './IPostCounters';
import IUser from '../../account/interfaces/IUser';
import IPlace from '../../place/interfaces/IPlace';

interface IPost {
  body: string;
  content_type: string;
  counters: IPostCounters;
  ellipsis: boolean;
  internal: boolean;
  is_trusted: boolean;
  last_update: number;
  no_comment: boolean;
  pinned: boolean;
  post_attachments: any[]; // fixme:: attachment interfaces
  post_places: IPlace[];
  post_read: boolean;
  post_recipients: any[];
  recent_comments: any[]; // fixme:: comment interface
  sender: IUser;
  email_sender: IUser;
  subject: string;
  timestamp: number;
  type: number;
  watched: boolean;
  reply_to: string;
  forward_from: string;
  _id: string;
}

export default IPost;