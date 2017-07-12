interface IComment {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  sender: string;
  removedById: string;
  removedBy: string;
  removed: string;
}

export default IComment;
