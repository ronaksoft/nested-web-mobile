"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_helmet_1 = require('react-helmet');
var serialize = require('serialize-javascript');
var Html = (function (_super) {
    __extends(Html, _super);
    function Html() {
        _super.apply(this, arguments);
    }
    Html.prototype.resolve = function (files) {
        var _this = this;
        return files.map(function (src) {
            if (!_this.props.manifest[src]) {
                return;
            }
            return '/public/' + _this.props.manifest[src];
        }).filter(function (file) { return file !== undefined; });
    };
    Html.prototype.render = function () {
        var head = react_helmet_1.Helmet.rewind();
        var _a = this.props, markup = _a.markup, store = _a.store;
        var styles = this.resolve(['vendor.css', 'app.css']);
        var renderStyles = styles.map(function (src, i) {
            return <link key={i} rel="stylesheet" type="text/css" href={src}/>;
        });
        var scripts = this.resolve(['vendor.js', 'app.js']);
        var renderScripts = scripts.map(function (src, i) {
            return <script src={src} key={i}/>;
        });
        // tslint:disable-next-line:max-line-length
        var initialState = (<script dangerouslySetInnerHTML={{ __html: "window.__INITIAL_STATE__=" + serialize(store.getState(), { isJSON: true }) + ";" }} charSet="UTF-8"/>);
        return (<html>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          {renderStyles}
          <link rel="shortcut icon" href="/favicon.ico"/>
        </head>
        <body>
          <main id="app" dangerouslySetInnerHTML={{ __html: markup }}/>
          {initialState}
          {renderScripts}
        </body>
      </html>);
    };
    return Html;
}(React.Component));
exports.Html = Html;
//# sourceMappingURL=index.js.map