import * as React from 'react';
import {
  Feed, FeedByActivity, Bookmarked, Shared,
  PlacePostsAllSortedByActivity, PlacePostsAllSortedByRecent,
  PlacePostsUnreadSortedByRecent,
  Notifications, Activities, Files, Compose, Signout,
} from 'scenes/private';
import Post from './../scenes/private/posts/components/post';
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
        <IndexRoute component={Feed}/>
        <Route path="/m/feed" component={Feed}/>
        <Route path="/m/feed/latest-activity" component={FeedByActivity}/>
        <Route path="/m/shared" component={Shared}/>
        <Route path="/m/bookmarks" component={Bookmarked}/>

        {/* All post sorted by activity*/}
        <Route path="/m/places/:placeId/messages" component={PlacePostsAllSortedByRecent}/>

        {/* All recent post */}
        <Route path="/m/places/:placeId/messages/latest-activity" component={PlacePostsAllSortedByActivity}/>

        {/* Unread post sorted by activity*/}
        <Route path="/m/places/:placeId/unread" component={PlacePostsUnreadSortedByRecent}/>

        <Route path="/m/places/:placeId/activities" component={Activities}/>
        <Route path="/m/places/:placeId/files" component={Files}/>
        <Route path="/m/messages/latest-activity" component={Activities}/>
        <Route path="/m/message/:postId" component={Post}/>
        <Route path="/m/notifications" component={Notifications}/>
        <Route path="/m/compose" component={Compose}/>
        <Route path="/m/reply/:replyId" component={Compose}/>
        <Route path="/m/reply/:replyId/sender" component={Compose}/>
        <Route path="/m/forward/:forwardId" component={Compose}/>
        <Route path="/m/signout" component={Signout}/>
        <Redirect from="/" to="/m/feed"/>
      </Route>
      <Route component={Public}>
        <Route path="/m/404" component={NotFound}/>
        <Route path="/m/signin" component={Signin}/>
        <Route path="/m/signup" component={Signup}>
          <IndexRoute component={SubmitPhone} />
          <Route path="/m/signup/phone(/:country)(/:code)(/:phone)" component={SubmitPhone}/>
          <Route path="/m/signup/verify/:country/:code/:phone/:vid" component={Verify}/>
          <Route path="/m/signup/register/:country/:code/:phone/:vid" component={Register}/>
        </Route>
        <Route path="*" component={NotFound}/>
      </Route>
      <Redirect from="*" to="/m/404"/>
    </Router>
  </Provider>
);
