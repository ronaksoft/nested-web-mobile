import IUser from '../../account/interfaces/IUser';

interface IComment {
  _id: string;
  text: string;
  timestamp: number;
  senderId: string;
  sender: IUser;
  removedById: string;
  removedBy: string;
  removed: boolean;
  attachmentId?: string;
  isSending?: boolean;
  isFailed?: boolean;
}

export default IComment;
