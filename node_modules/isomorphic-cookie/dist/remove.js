'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function remove
 * @description this removes a cookie
 */

exports.default = function (name, opt, res) {
  var options = opt = Object.assign({}, opt || {});

  if (typeof document !== 'undefined') {
    opt.expires = new Date(1970, 1, 1, 0, 0, 1);
    document.cookie = _cookie2.default.serialize(name, '', options);
  }

  if ((0, _util.isResWritable)(res) && res.clearCookie) {
    res.clearCookie(name, options);
  }

  // hapi
  if ((0, _util.isResWritable)(res) && res.unstate) {
    res.unstate(name);
  }
};