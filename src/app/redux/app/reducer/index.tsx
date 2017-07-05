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
});

export default function appReducer(state = initialState, action?: IAppAction) {
  switch (action.type) {
    case ActionTypes.APP_LOGIN:
      return Immutable.merge(state, {
        isLogin: true,
      });

    case ActionTypes.APP_LOGOUT:
      return Immutable.merge(state, {
        isLogin: false,
      });
    default :
      return state;

  }
}
