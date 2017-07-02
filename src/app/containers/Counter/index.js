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
var _1 = require('modules/counter/');
var connect = require('react-redux').connect;
var style = require('./style.css');
var Counter = (function (_super) {
    __extends(Counter, _super);
    function Counter() {
        _super.apply(this, arguments);
    }
    Counter.prototype.render = function () {
        var _a = this.props, increment = _a.increment, decrement = _a.decrement, counter = _a.counter;
        return (<div className={style.Counter}>
        <h4>Counter Example</h4>
        <button name="incBtn" onClick={increment}>
          INCREMENT
        </button>
        <button name="decBtn" onClick={decrement} disabled={counter.count <= 0}>
          DECREMENT
        </button>
        <p>{counter.count}</p>
      </div>);
    };
    Counter = __decorate([
        connect(function (state) { return ({ counter: state.counter }); }, function (dispatch) { return ({
            decrement: function () { return dispatch(_1.decrement()); },
            increment: function () { return dispatch(_1.increment()); }
        }); })
    ], Counter);
    return Counter;
}(React.Component));
exports.Counter = Counter;
//# sourceMappingURL=index.js.map