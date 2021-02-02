import * as React from 'react';
import {
  Posts, PostsContainer, Settings, Profile, General, Password,
  Notifications, Activities, Files, Compose, Signout, Search,
  Tasks, TaskEdit, TaskActivities, Session,
} from 'scenes/private';
import Post from './../scenes/private/posts/components/post';
import Private from 'scenes/private';
import {Public, Signin, Signup, NotFound, Workspace} from 'scenes/public';
import {SubmitPhone, Verify, Register} from 'scenes/public/Signup';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, Redirect} from 'react-router';
import {configureStore} from 'redux/store';
import Members from '../scenes/private/place/members';

const store = configureStore(hashHistory);

export default (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={Private}>
        <IndexRoute component={Posts}/>

        <Route component={PostsContainer}>
          {/* <Redirect from="/" to="/feed" /> */}
          <Route path="/" component={Posts}/>
          <Route path="/feed" component={Posts}/>
          <Route path="/feed/latest-activity" component={Posts}/>
          <Route path="/shared" component={Posts}/>
          <Route path="/bookmarks" component={Posts}/>

          {/* All post sorted by activity*/}
          <Route path="/places/:placeId/messages" component={Posts}/>

          {/* All recent post */}
          <Route path="/places/:placeId/messages/latest-activity" component={Posts}/>

          {/* Unread post sorted by activity*/}
          <Route path="/places/:placeId/unread" component={Posts}/>

          <Route path="/places/:placeId/activity" component={Activities}/>
          <Route path="/places/:placeId/files/:filter/:search" component={Files}/>
          <Route path="/places/:placeId/files/:filter" component={Files}/>
          <Route path="/places/:placeId/files/" component={Files}/>
          <Route path="/places/:placeId/members" component={Members}/>
        </Route>

        <Route component={Settings}>
          <Route path="/settings/profile" component={Profile}/>
          <Route path="/settings/general" component={General}/>
          <Route path="/settings/password" component={Password}/>
          <Route path="/settings/session" component={Session}/>
          <Redirect from="/settings" to="/settings/profile"/>
        </Route>

        <Route path="/message/:postId" component={Post}/>
        <Route path="/compose" component={Compose}/>
        <Route path="/compose/edit/:editPostId" component={Compose}/>
        <Route path="/reply/:replyId" component={Compose}/>
        <Route path="/reply/:replyId/sender" component={Compose}/>
        <Route path="/forward/:forwardId" component={Compose}/>
        <Route path="/compose/:attachments" component={Compose}/>

        <Route path="/task/glance" component={Tasks}/>
        <Route path="/task/assigned_to_me/normal" component={Tasks}/>
        <Route path="/task/assigned_to_me/completed" component={Tasks}/>
        <Route path="/task/created_by_me/normal" component={Tasks}/>
        <Route path="/task/created_by_me/completed" component={Tasks}/>
        <Route path="/task/watchlist/normal" component={Tasks}/>
        <Route path="/task/watchlist/completed" component={Tasks}/>
        <Route path="/task/create" component={TaskEdit}/>
        <Route path="/task/create/:relatedTask" component={TaskEdit}/>
        <Route path="/task/edit/:taskId" component={TaskEdit}/>
        <Route path="/task/activity/:taskId" component={TaskActivities}/>
        <Route path="/task/custom_filter/:filterId" component={Tasks}/>
        <Route path="/notifications" component={Notifications}/>
        <Route path="/notifications/:app" component={Notifications}/>
        <Route path="/search/:query/:advanced" component={Search}/>
        <Route path="/task/search/:query/:advanced" component={Search}/>

        <Route path="/signout" component={Signout}/>
      </Route>
      <Route component={Public}>
        <Route path="/404" component={NotFound}/>
        <Route path="/workspace" component={Workspace}/>
        <Route path="/workspace/force" component={Workspace}/>
        <Route path="/signin" component={Workspace}/>
        <Route path="/signin/:domain" component={Signin}/>
        <Route path="/signup" component={Signup}>
          <IndexRoute component={SubmitPhone}/>
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
