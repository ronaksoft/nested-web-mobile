import * as Immutable from 'seamless-immutable';
import {IAppAction} from '../IAppStore';
import * as ActionTypes from '../actions/types';

/** Initial Places State */
const initialState = Immutable.from<IAppStore>({
  isSocketConnect: false,
  placesUnseenCounters: [],
  isLogin: false,
  user: null,
  userPlaces: [],
  notifications: [],
  notificationsCount: 0,
  posts: [],
  sidebarPlaces: [],
  currentPost: null,
});

export default function appReducer(state = initialState, action?: IAppAction) {
  switch (action.type) {
    case ActionTypes.APP_LOGIN:
      return Immutable.merge(state, {
        isLogin: true,
        user: action.payload,
      });

    case ActionTypes.APP_LOGOUT:
      return Immutable.merge(state, {
        isLogin: false,
        user: null,
      });

    case ActionTypes.APP_NOTIFICATION_SET:
      return Immutable.merge(state, {
        notifications: action.payload,
      });

    case ActionTypes.APP_NOTIFICATION_UNSET:
      return Immutable.merge(state, {
        notifications: [],
      });

    case ActionTypes.APP_NOTIFICATION_COUNT:
      return Immutable.merge(state, {
        notificationsCount: action.payload,
      });

    case ActionTypes.APP_POSTS_SET:
      return Immutable.merge(state, {
        posts: action.payload,
      });

    case ActionTypes.APP_POSTS_UNSET:
      return Immutable.merge(state, {
        posts: [],
      });

    case ActionTypes.APP_USER_PLACES_SET:
      return Immutable.merge(state, {
        userPlaces: action.payload,
      });

    case ActionTypes.APP_USER_PLACES_UNSET:
      return Immutable.merge(state, {
        userPlaces: [],
      });

    case ActionTypes.APP_SIDEBAR_PLACES_SET:
      return Immutable.merge(state, {
        sidebarPlaces: action.payload,
      });

    case ActionTypes.APP_SIDEBAR_PLACES_UNSET:
      return Immutable.merge(state, {
        sidebarPlaces: [],
      });

    case ActionTypes.APP_CURRENT_POST_SET:
      return Immutable.merge(state, {
        currentPost: action.payload,
      });

    case ActionTypes.APP_CURRENT_POST_UNSET:
      return Immutable.merge(state, {
        currentPost: null,
      });

    default :
      return state;

  }
}
