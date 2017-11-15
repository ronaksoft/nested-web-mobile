import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, hashHistory } = require('react-router');
// import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';
import 'isomorphic-fetch';
import routes from './app/routes';
import 'antd/dist/antd.less';

const store = configureStore(
  hashHistory,
  window.__INITIAL_STATE__,
);
// const history = syncHistoryWithStore(hashHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router
      history={hashHistory}
      render={connectedCmp}
    >
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app'),
);
