"use strict";
var appConfig = require('../../../config/main');
var redux_1 = require('redux');
var react_router_redux_1 = require('react-router-redux');
var redux_thunk_1 = require('redux-thunk');
var reducers_1 = require('./reducers');
var createLogger = require('redux-logger');
function configureStore(history, initialState) {
    var middlewares = [
        react_router_redux_1.routerMiddleware(history),
        redux_thunk_1["default"],
    ];
    /** Add Only Dev. Middlewares */
    if (appConfig.env !== 'production' && process.env.BROWSER) {
        var logger = createLogger();
        middlewares.push(logger);
    }
    var composeEnhancers = (appConfig.env !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || redux_1.compose;
    var store = redux_1.createStore(reducers_1["default"], initialState, composeEnhancers(redux_1.applyMiddleware.apply(void 0, middlewares)));
    if (appConfig.env === 'development' && module.hot) {
        module.hot.accept('./reducers', function () {
            store.replaceReducer((require('./reducers')));
        });
    }
    return store;
}
exports.configureStore = configureStore;
//# sourceMappingURL=store.js.map