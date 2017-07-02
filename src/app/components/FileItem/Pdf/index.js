"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Pdf = (function (_super) {
    __extends(Pdf, _super);
    function Pdf() {
        _super.apply(this, arguments);
    }
    Pdf.prototype.render = function () {
        var _a = this.props, id = _a.id, label = _a.label;
        return (<div>
        {id}.{label}
      </div>);
    };
    return Pdf;
}(React.Component));
exports.__esModule = true;
exports["default"] = Pdf;
//# sourceMappingURL=index.js.map