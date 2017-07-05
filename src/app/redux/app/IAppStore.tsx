import IUser from '../../api/account/interfaces/IUser';
import INotificationResponse from '../../api/notification/interfaces/INotificationRequest';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  placesUnseenCounters: any[];
  notifications: INotificationResponse[];
}

export interface IAppAction {
  type: string;
  payload?: INotificationResponse[] | IUser | boolean;
}
