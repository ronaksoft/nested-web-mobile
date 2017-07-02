"use strict";
var React = require('react');
var react_router_1 = require('react-router');
var style = require('./style.css');
exports.Header = function () { return (<nav className={style.Nav}>
    <ul>
      <li><react_router_1.Link to="/">Home</react_router_1.Link></li>
      <li><react_router_1.Link to="about">About</react_router_1.Link></li>
      <li><react_router_1.Link to="counter">Counter</react_router_1.Link></li>
      <li><react_router_1.Link to="stars">Stars</react_router_1.Link></li>
    </ul>
  </nav>); };
//# sourceMappingURL=index.js.map