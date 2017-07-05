interface INotificationResponse {
  _id: string;
  type: number;
  read: boolean;
  timestamp?: number;
  comment_id?: string;
  post_id?: string;
  actor_id?: string;
  account_id?: string;
  place_id?: string;
  invite_id?: string;
  others?: any;
}

export default INotificationResponse;
