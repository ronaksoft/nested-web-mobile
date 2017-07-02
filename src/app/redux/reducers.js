"use strict";
var redux_1 = require('redux');
var react_router_redux_1 = require('react-router-redux');
var counter_1 = require('./modules/counter');
var stars_1 = require('./modules/stars');
var reducer = require('redux-connect').reducer;
var rootReducer = redux_1.combineReducers({
    routing: react_router_redux_1.routerReducer,
    counter: counter_1.counterReducer,
    stars: stars_1.starsReducer,
    reduxAsyncConnect: reducer
});
exports.__esModule = true;
exports["default"] = rootReducer;
//# sourceMappingURL=reducers.js.map