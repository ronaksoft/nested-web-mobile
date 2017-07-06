import IUser from '../../api/account/interfaces/IUser';
import INotificationResponse from '../../api/notification/interfaces/INotificationRequest';
import INotificationCountRequest from '../../api/notification/interfaces/INotificationCountResponse';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  placesUnseenCounters: any[];
  notifications: INotificationResponse[];
  notificationsCount: INotificationCountRequest;
}

export interface IAppAction {
  type: string;
  payload?: INotificationCountRequest | INotificationResponse[] | IUser | number | boolean;
}
