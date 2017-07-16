interface INotification {
  _id: string;
  type: number;
  read: boolean;
  timestamp?: number;
  comment_id?: string;
  post_id?: string;
  actor_id?: string;
  account_id?: string;
  data?: any;
  place_id?: string;
  invite_id?: string;
  others?: any;
  _cid?: string;
}

export default INotification;
