'use strict';

var _save = require('./save');

var _save2 = _interopRequireDefault(_save);

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

var _remove = require('./remove');

var _remove2 = _interopRequireDefault(_remove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./polyfill');

module.exports = {
  load: _load2.default,
  save: _save2.default,
  remove: _remove2.default
};