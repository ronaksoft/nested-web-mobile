import IUser from '../../api/account/interfaces/IUser';
import INotificationResponse from '../../api/notification/interfaces/INotificationRequest';
import INotificationCountRequest from '../../api/notification/interfaces/INotificationCountResponse';
import IPost from '../../api/post/interfaces/IPost';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  placesUnseenCounters: any[];
  notifications: INotificationResponse[];
  notificationsCount: INotificationCountRequest;
  posts: IPost[];
  sidebarPlaces: ISidebarPlace[];
  sidebarPlacesUnreads: any;
}

export interface IAppAction {
  type: string;
  payload?: INotificationCountRequest | INotificationResponse[] | IUser | number | boolean;
}
