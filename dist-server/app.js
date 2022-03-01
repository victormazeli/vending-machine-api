"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _dbconfig = _interopRequireDefault(require("./config/dbconfig"));

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
(0, _dbconfig.default)();
app.use(_index.default);
app.get('/', (req, res) => {
  res.send('Welcome, Testing api');
});
var _default = app;
exports.default = _default;