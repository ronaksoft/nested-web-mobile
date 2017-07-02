"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var appConfig = require('../../../../config/main');
var React = require('react');
var react_helmet_1 = require('react-helmet');
var components_1 = require('components');
var style = require('./style.css');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return (<section className={style.AppContainer}>
        <react_helmet_1.Helmet {...appConfig.app} {...appConfig.app.head}/>
        <components_1.Header />
        {this.props.children}
      </section>);
    };
    return App;
}(React.Component));
exports.App = App;
//# sourceMappingURL=index.js.map