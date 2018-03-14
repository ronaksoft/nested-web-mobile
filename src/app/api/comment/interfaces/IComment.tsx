import IUser from '../../account/interfaces/IUser';

interface IComment {
  _id: string;
  text: string;
  timestamp: number;
  sender_id: string;
  sender: IUser;
  removed_by_id: string;
  removed_by: string;
  removed: string;
  attachment_id?: string;
}

export default IComment;
