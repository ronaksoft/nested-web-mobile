import {IUser} from 'api/interfaces';
import INotificationResponse from '../../api/notification/interfaces/INotificationRequest';
import INotificationCountResponse from '../../api/notification/interfaces/INotificationCountResponse';
import IPost from '../../api/post/interfaces/IPost';
import ITask from '../../api/task/interfaces/ITask';
import ICustomFilter from '../../api/task/interfaces/ICustomFilter';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';
import IUnreadPlace from '../../api/place/interfaces/IUnreadPlace';
import {IPlaceActivity} from 'api/interfaces/';
import IComposeState from 'api/post/interfaces/IComposeState';

export interface IAppStore {
  isSocketConnect: boolean;
  isLogin: boolean;
  user: IUser | null;
  userPlaces: string[];
  notifications: INotificationResponse[];
  notificationsCount: INotificationCountResponse;
  posts: IPost[];
  tasks: any | ITask[];
  activities: any | IPlaceActivity[];
  postsRoute: string;
  tasksRoute: string;
  sidebarPlaces: ISidebarPlace[];
  sidebarPlacesUnreads: IUnreadPlace;
  taskCustomFilters: ICustomFilter[];
  currentPost: IPost | null;
  currentTask: ITask | null;
  draft: IComposeState | null;
  draftTask: IComposeState | null;
  scrollPositions: any;
}

export interface IAppAction {
  type: string;
  payload?: number | boolean | string | IPost | IPost[] | ITask | ITask[] | IPlaceActivity | IPlaceActivity[]
    | IUser | INotificationCountResponse | INotificationResponse[]
    | IComposeState | ICustomFilter[] | any;
}
