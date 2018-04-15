import IPostCounters from './IPostCounters';
import {IPlace, IUser, ILabel, IComment} from 'api/interfaces';
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
  post_attachments: IPostAttachment[];
  post_places: IPlace[];
  post_read: boolean;
  post_recipients: any[];
  recent_comments: IComment[];
  sender: IUser;
  email_sender: IUser;
  subject: string;
  timestamp: number;
  type: number;
  watched: boolean;
  reply_to: string;
  forward_from: string;
  post_labels: ILabel[];
  iframe_url: string;
  _id: string;
  pinnedInPlace?: boolean;
}

export default IPost;
