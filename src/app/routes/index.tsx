import * as React from 'react';
import {Posts, Notifications, Activities, Files, Compose, Signout} from 'scenes/private';
import Private from 'scenes/private';
import {Public, Signin, Signup, NotFound} from 'scenes/public';
import {SubmitPhone, Verify, Register} from 'scenes/public/Signup';
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
        <Route path="/signout" component={Signout}/>
        <Redirect from="/" to="/feed"/>
      </Route>
      <Route component={Public}>
        <Route path="/404" component={NotFound}/>
        <Route path="/signin" component={Signin}/>
        <Route path="/signup" component={Signup}>
          <Route path="/signup/phone(/:country)(/:code)(/:phone)" component={SubmitPhone}/>
          <Route path="/signup/verify/:country/:code/:phone/:vid" component={Verify}/>
          <Route path="/signup/register/:country/:code/:phone/:vid" component={Register}/>
        </Route>
        <Route path="*" component={NotFound}/>
      </Route>
      <Redirect from="*" to="/404"/>
    </Router>
  </Provider>
);
