import * as React from 'react';
import { Private, Posts, Activities, Files, Notifications, Compose } from 'scenes/private';
import { Public, Signin, Signup, NotFound } from 'scenes/public';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router';
import {configureStore} from 'redux/store';

const store = configureStore(browserHistory);

export default (
  <Provider store={store}>
      <Router history={browserHistory}>
          <Route component={Private}>
              <IndexRoute component={Posts}/>
              <Route path="/feed" component={Posts}/>
              <Route path="/shared" component={Posts}/>
              <Route path="/bookmarks" component={Posts}/>
              <Route path="/place/:placeId/posts" component={Posts}/>
              <Route path="/place/:placeId/activities" component={Activities}/>
              <Route path="/place/:placeId/files" component={Files}/>
              <Route path="/notifications" component={Notifications}/>
              <Route path="/compose" component={Compose}/>
              <Redirect from="/" to="/feed" />
          </Route>
          <Route component={Public}>
              <Route path="/404" component={NotFound}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="*" component={NotFound} />
          </Route>
          <Redirect from="*" to="/404" />
      </Router>
  </Provider>
);
