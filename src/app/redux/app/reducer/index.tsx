import * as Immutable from 'seamless-immutable';
import {IAppAction} from '../IAppStore';
import * as ActionTypes from '../actions/types';

/** Initial Places State */
const initialState = Immutable.from<IAppAction>({
  isSocketConnect: false,
  sidebarUnreadPlaces: null,
  isLogin: false,
  user: null,
  userPlaces: [],
  notifications: [],
  notificationsCount: 0,
  posts: [],
  tasks: [],
  sidebarPlaces: [],
  currentPost: null,
  scrollPositions: {},
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

    case ActionTypes.APP_POSTS_ROUTE_SET:
      return Immutable.merge(state, {
        postsRoute: action.payload,
      });

    case ActionTypes.APP_POSTS_UNSET:
      return Immutable.merge(state, {
        postsRoute: '',
      });

    case ActionTypes.APP_TASK_FILTER_SET:
      return Immutable.merge(state, {
        taskCustomFilters: action.payload,
      });

    case ActionTypes.APP_TASK_FILTER_UNSET:
      return Immutable.merge(state, {
        taskCustomFilters: [],
      });

    case ActionTypes.APP_TASKS_SET:
      return Immutable.merge(state, {
        tasks: Immutable.merge(state.tasks, action.payload),
      });

    case ActionTypes.APP_TASKS_UNSET:
      return Immutable.merge(state, {
        tasks: {},
      });

    case ActionTypes.APP_TASKS_ROUTE_SET:
      return Immutable.merge(state, {
        tasksRoute: action.payload,
      });

    case ActionTypes.APP_TASKS_ROUTE_UNSET:
      return Immutable.merge(state, {
        tasksRoute: '',
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

    case ActionTypes.APP_UNREAD_PLACES_SET:
      return Immutable.merge(state, {
        sidebarPlacesUnreads: action.payload,
      });

    case ActionTypes.APP_UNREAD_PLACES_UNSET:
      return Immutable.merge(state, {
        sidebarPlacesUnreads: [],
      });

    case ActionTypes.APP_CURRENT_POST_SET:
      return Immutable.merge(state, {
        currentPost: action.payload,
      });

    case ActionTypes.APP_CURRENT_POST_UNSET:
      return Immutable.merge(state, {
        currentPost: null,
      });

    case ActionTypes.APP_DRAFT_SET:
      return Immutable.merge(state, {
        draft: action.payload,
      });

    case ActionTypes.APP_DRAFT_UNSET:
      return Immutable.merge(state, {
        draft: null,
      });

    case ActionTypes.APP_SCROLL_POSITION_SET:
      return Immutable.merge(state, {
        scrollPositions: Immutable.merge(state.scrollPositions, action.payload),
      });

    case ActionTypes.APP_SCROLL_POSITION_UNSET:
      return Immutable.merge(state, {
        scrollPositions: {},
      });

    default :
      return state;

  }
}
