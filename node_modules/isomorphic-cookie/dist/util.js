"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isResWritable = isResWritable;
/**
 * @file util
 * @description some utility functions
 */

function isResWritable(res) {
  if (!res) {
    return false;
  }

  // TODO: check if this is the same in Hapi
  if (res.headersSent === true) {
    return false;
  }

  return true;
}