"use strict";

var _app = _interopRequireDefault(require("./app"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const port = process.env.PORT || 7000;

const server = _app.default.listen(port, () => {
  console.log(`Server started on ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`); // Close server & exit process

  server.close(() => process.exit(1));
});