import IPostCounters from './IPostCounters';
import IPostPlace from './IPostPlace';
import IUser from '../../account/interfaces/IUser';

interface IPost {
  content_type: string;
  counters: IPostCounters;
  ellipsis: boolean;
  internal: boolean;
  is_trusted: boolean;
  last_update: number;
  no_comment: boolean;
  pinned: boolean;
  post_attachments: any[]; // fixme:: attachment interfaces
  post_places: IPostPlace[];
  post_read: boolean;
  post_recipients: any[];
  recent_comments: any[]; // fixme:: comment interface
  sender: IUser;
  subject: string;
  timestamp: number;
  type: number;
  watched: boolean;
  _id: string;
}

export default IPost;
