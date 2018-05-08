import {INotification} from 'api/interfaces/';

interface INotificationResponse {
  data: INotificationData;
}

export interface INotificationData {
  skip?: number;
  limit?: number;
  before?: number | null;
  after?: number | null;
  notifications: INotification[];
}

export default INotificationResponse;
