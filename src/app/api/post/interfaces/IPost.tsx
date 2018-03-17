import IPostCounters from './IPostCounters';
import IUser from '../../account/interfaces/IUser';
import IPlace from '../../place/interfaces/IPlace';
import ILabel from '../../label/interfaces/ILabel';
import IPostAttachment from './IPostAttachment';

interface IPost {
  body: string;
  preview: string;
  content_type: string;
  counters: IPostCounters;
  ellipsis: boolean;
  internal: boolean;
  is_trusted: boolean;
  last_update: number;
  no_comment: boolean;
  pinned: boolean;
  post_attachments: IPostAttachment[]; // fixme:: attachment interfaces
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
  post_labels: ILabel[];
  _id: string;
}

export default IPost;
