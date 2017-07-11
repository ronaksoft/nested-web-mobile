import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {IStore} from './IStore';
import placeReducer from './places/reducer/index';
import accountReducer from './accounts/reducer/index';
import appReducer from './app/reducer/index';
import commentReducer from './comments/reducer/index';

const {reducer} = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  comments : commentReducer,
  places: placeReducer,
  accounts: accountReducer,
  app : appReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
