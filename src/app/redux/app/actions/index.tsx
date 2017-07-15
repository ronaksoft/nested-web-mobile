import {} from '../IAppStore';
import * as ActionTypes from './types';
import IUser from '../../../api/account/interfaces/IUser';
import {IAppAction} from '../IAppStore';
import INotificationCountRequest from '../../../api/notification/interfaces/INotificationCountResponse';
import IPost from '../../../api/post/interfaces/IPost';
import ISidebarPlace from '../../../api/place/interfaces/ISidebarPlace';
import IComposeState from 'api/post/interfaces/IComposeState';

export function userSet(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_SET,
    payload: user,
  };
}

export function userUpdate(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_UPDATE,
    payload: user,
  };
}

export function userUnset(): IAppAction {
  return {
    type: ActionTypes.APP_USER_UNSET,
  };
}

export function login(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_LOGIN,
    payload: user,
  };
}

export function logout(): IAppAction {
  return {
    type: ActionTypes.APP_LOGOUT,
  };
}

export function setNotificationCount(counts: INotificationCountRequest): IAppAction {
  return {
    type: ActionTypes.APP_NOTIFICATION_COUNT,
    payload: counts,
  };
}

export function setNotification(notifications: any[]): IAppAction {
  return {
    type: ActionTypes.APP_NOTIFICATION_SET,
    payload: notifications,
  };
}

export function unsetNotification(notifications: any[]): IAppAction {
  return {
    type: ActionTypes.APP_NOTIFICATION_SET,
    payload: notifications,
  };
}

export function setPosts(posts: IPost[]): IAppAction {
  return {
    type: ActionTypes.APP_POSTS_SET,
    payload: posts,
  };
}

export function unsetPosts(): IAppAction {
  return {
    type: ActionTypes.APP_POSTS_UNSET,
  };
}

export function setCurrentPost(post: IPost): IAppAction {
  return {
    type: ActionTypes.APP_CURRENT_POST_SET,
    payload: post,
  };
}

export function unsetCurrentPost(): IAppAction {
  return {
    type: ActionTypes.APP_CURRENT_POST_UNSET,
  };
}

export function setUserPlaces(placeIds: string[]): IAppAction {
  return {
    type: ActionTypes.APP_USER_PLACES_SET,
    payload: placeIds,
  };
}

export function unsetUserPlaces(): IAppAction {
  return {
    type: ActionTypes.APP_USER_PLACES_UNSET,
  };
}

export function setSidebarPlaces(places: ISidebarPlace[]): IAppAction {
  return {
    type: ActionTypes.APP_SIDEBAR_PLACES_SET,
    payload: places,
  };
}

export function unsetSidebarPlaces(): IAppAction {
  return {
    type: ActionTypes.APP_SIDEBAR_PLACES_UNSET,
  };
}

export function setUnreadPlaces(unreadPlaces: any): IAppAction {
  return {
    type: ActionTypes.APP_UNREAD_PLACES_SET,
    payload: unreadPlaces,
  };
}

export function unsetUnreadPlaces(): IAppAction {
  return {
    type: ActionTypes.APP_UNREAD_PLACES_UNSET,
  };
}

export function unsetDraft(): IAppAction {
  return {
    type: ActionTypes.APP_DRAFT_UNSET,
  };
}
export function setDraft(model: IComposeState): IAppAction {
  return {
    type: ActionTypes.APP_DRAFT_SET,
    payload: model,
  };
}
