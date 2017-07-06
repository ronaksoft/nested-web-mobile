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

    default :
      return state;

  }
}
