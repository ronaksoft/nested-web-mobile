import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {IStore} from './IStore';
import placeReducer from './places/reducer/index';
import accountReducer from './accounts/reducer/index';
import appReducer from './app/reducer/index';
import commentReducer from './comments/reducer/index';
import postReducer from './posts/reducer/index';
import taskReducer from './tasks/reducer/index';

const {reducer} = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  comments : commentReducer,
  posts : postReducer,
  places: placeReducer,
  accounts: accountReducer,
  app : appReducer,
  tasks : taskReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
