import IUser from '../../api/account/interfaces/IUser';
import INotificationResponse from '../../api/notification/interfaces/INotificationRequest';
import INotificationCountRequest from '../../api/notification/interfaces/INotificationCountResponse';
import IPost from '../../api/post/interfaces/IPost';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';
import IUnreadPlace from '../../api/place/interfaces/IUnreadPlace';
import IComposeState from 'api/post/interfaces/IComposeState';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  notifications: INotificationResponse[];
  notificationsCount: INotificationCountRequest;
  posts: IPost[];
  sidebarPlaces: ISidebarPlace[];
  sidebarPlacesUnreads: IUnreadPlace;
  currentPost: IPost | null;
  draft: IComposeState | null;
}

export interface IAppAction {
  type: string;
  payload?: IPost | IPost[] | INotificationCountRequest | INotificationResponse[] | IUser | number | boolean | IComposeState;
}
