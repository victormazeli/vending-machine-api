"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

const router = (0, _express.Router)();
/**
 * @description - This the vendors routes
 */

router.get('/', (req, res) => {
  res.send('testing vendor service route');
});
var _default = router;
exports.default = _default;