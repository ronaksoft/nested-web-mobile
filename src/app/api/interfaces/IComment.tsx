import {IUser} from 'api/interfaces';

interface IComment {
  _id: string;
  text: string;
  timestamp: number;
  sender: IUser;
  sender_id?: string;
  removed_by_id?: string;
  removed_by?: string;
  removed?: boolean;
  attachment_id?: string;
  isSending?: boolean;
  isFailed?: boolean;
}

export default IComment;
