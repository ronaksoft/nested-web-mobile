interface INotificationRequest {
  skip?: number;
  limit?: number;
  before?: number | null;
  after?: number | null;
}

export default INotificationRequest;
