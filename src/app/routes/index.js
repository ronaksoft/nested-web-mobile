"use strict";
var React = require('react');
var private_1 = require('scenes/private');
var public_1 = require('scenes/public');
// import {Provider} from 'react-redux';
var react_router_1 = require('react-router');
exports.__esModule = true;
exports["default"] = (
// <Provider store={store}>
<react_router_1.Router history={react_router_1.browserHistory}>
          <react_router_1.Route path="/">
              <react_router_1.IndexRoute component={private_1.Posts}/>
              <react_router_1.Route path="/posts" component={private_1.Posts}/>
              <react_router_1.Route path="/activities" component={private_1.Activities}/>
              <react_router_1.Route path="/files" component={private_1.Files}/>
              <react_router_1.Route path="/notifications" component={private_1.Notifications}/>
              <react_router_1.Route path="/compose" component={private_1.Compose}/>
          </react_router_1.Route>
          <react_router_1.Route>
              <react_router_1.Route path="/404" component={public_1.NotFound}/>
              <react_router_1.Route path="/signin" component={public_1.Signin}/>
              <react_router_1.Route path="/signup" component={public_1.Signup}/>
              <react_router_1.Route path="*" component={public_1.NotFound}/>
          </react_router_1.Route>
          <react_router_1.Redirect from="*" to="/404"/>
      </react_router_1.Router>);
//# sourceMappingURL=index.js.map