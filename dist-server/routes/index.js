"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _vendors = _interopRequireDefault(require("./vendors"));

var _users = _interopRequireDefault(require("./users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
/**
 * @description - This the root route for all services.
 */

app.use('/vendors', _vendors.default);
app.use('/users', _users.default);
var _default = app;
exports.default = _default;