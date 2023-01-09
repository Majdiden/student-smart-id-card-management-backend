"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.encode = encode;
exports.decode = decode;
/**
 * @file encoding
 * @description this holds encoding and decoding logic in a centralized place
 */

var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$");

/**
 * checks for base64 encoding by trying to decode
 */
function isBase64(string) {
  return base64Matcher.test(string);
}

/**
 * this handles encoding so that encoding and decoding logic are co-located
 */
function encode(value) {
  var returnValue = value;

  // convert objects to strings first
  if ((typeof returnValue === "undefined" ? "undefined" : _typeof(returnValue)) === 'object') {
    returnValue = JSON.stringify(returnValue);
  }

  // if it's not base64 encoded, we need to uri encode it
  if (!isBase64(returnValue)) {
    returnValue = encodeURIComponent(returnValue);
  }

  return returnValue;
}

function decode(value, doNotParse) {
  var returnValue = value;

  // if they passed a base64 value, we didn't encode and won't mess
  if (returnValue && !isBase64(returnValue)) {
    // if it wasn't base64, we uri encoded when setting, so decode
    returnValue = decodeURIComponent(returnValue);
  }

  // check if it's JSON
  if (!doNotParse) {
    try {
      returnValue = JSON.parse(returnValue);
    } catch (e) {
      // leave it be, it's a string
    }
  }

  return returnValue;
}