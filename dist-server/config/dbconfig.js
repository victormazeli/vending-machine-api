"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbconstant = _interopRequireDefault(require("./dbconstant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const connectDB = async () => {
  try {
    const conn = await _mongoose.default.connect(_dbconstant.default.development, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

var _default = connectDB;
exports.default = _default;