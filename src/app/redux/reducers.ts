import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {IStore} from './IStore';
// import placeReducer from './modules/places/reducer/index';
// import accountReducer from './modules/accounts/reducer/index';

const {reducer} = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  // places: placeReducer,
  // accounts: accountReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
