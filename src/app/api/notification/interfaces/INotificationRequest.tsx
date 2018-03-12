interface INotificationRequest {
  skip?: number;
  limit?: number;
  before?: number | null;
  after?: number | null;
  details?: boolean;
  only_unread?: boolean;
  subject?: string;
}

export default INotificationRequest;
