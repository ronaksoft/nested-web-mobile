import * as React from 'react';
import { Posts, Activities, Files, Notifications, Compose } from 'scenes/private';
import { Signin, Signup, NotFound } from 'scenes/public';
// import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router';
// import {IStore} from '~react-redux~redux';
// import configureStore from './app/services/store/configureStore';

// const store: IStore<any> = configureStore({});

export default (
  // <Provider store={store}>
      <Router history={browserHistory}>
          <Route path="/">
              <IndexRoute component={Posts}/>
              <Route path="/posts" component={Posts}/>
              <Route path="/activities" component={Activities}/>
              <Route path="/files" component={Files}/>
              <Route path="/notifications" component={Notifications}/>
              <Route path="/compose" component={Compose}/>
          </Route>
          <Route>
              <Route path="/404" component={NotFound}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="*" component={NotFound} />
          </Route>
          <Redirect from="*" to="/404" />
      </Router>
  // </Provider>
);
