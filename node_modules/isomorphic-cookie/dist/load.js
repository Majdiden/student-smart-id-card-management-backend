'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _encoding = require('./encoding');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function load
 * @description this loads a cookie
 */

exports.default = function (name, request, doNotParse) {
  var cookies = void 0;

  if (typeof document !== 'undefined') {
    cookies = _cookie2.default.parse(document.cookie);
  } else if (request) {
    // grab cookies from the request if they pass it
    // @TODO: find out and comment exactly which servers and such these support
    if (request.cookie) {
      cookies = request.cookie;
    } else if (request.cookies) {
      cookies = request.cookies;
    } else if (request.headers && request.headers.cookie) {
      cookies = _cookie2.default.parse(request.headers.cookie);
    }
  }

  var cookieVal = cookies && (0, _encoding.decode)(cookies[name], doNotParse);

  return cookieVal;
};