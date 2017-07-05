"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var style = require('./style.css');
var About = (function (_super) {
    __extends(About, _super);
    function About() {
        _super.apply(this, arguments);
    }
    About.prototype.render = function () {
        return (<div className={style.About}>
        <h4>About</h4>
      </div>);
    };
    return About;
}(React.Component));
exports.About = About;
//# sourceMappingURL=index.js.map