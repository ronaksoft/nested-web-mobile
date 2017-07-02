"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var React = require('react');
var stars_1 = require('modules/stars');
var connect = require('react-redux').connect;
var asyncConnect = require('redux-connect').asyncConnect;
var style = require('./style.css');
var Stars = (function (_super) {
    __extends(Stars, _super);
    function Stars() {
        _super.apply(this, arguments);
    }
    Stars.prototype.render = function () {
        var stars = this.props.stars;
        return (<div className={style.Stars}>
        {stars.isFetching ? 'Fetching Stars' : stars.count}
      </div>);
    };
    Stars = __decorate([
        asyncConnect([{
                promise: function (_a) {
                    var dispatch = _a.store.dispatch;
                    return dispatch(stars_1.getStars());
                }
            }]),
        connect(function (state) { return ({ stars: state.stars }); })
    ], Stars);
    return Stars;
}(React.Component));
exports.Stars = Stars;
//# sourceMappingURL=index.js.map