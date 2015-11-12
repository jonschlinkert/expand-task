'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('isobject', 'isObject');
require('extend-shallow', 'extend');
require('define-property', 'define');

/**
 * Restore `require`
 */

require = fn;

/**
 * Utils
 */

utils.run = function(parent, key, child) {
  utils.define(child, 'parent', parent);
  utils.define(child, 'orig', utils.extend({}, child));
  utils.define(child, '_name', key);
  child[key] = true;
  parent.run(child);
  delete child[key];
};

/**
 * Return true if the given value has "task" properties
 */

utils.isTask = function(val) {
  for (var key in val) {
    if (utils.isTarget(val[key])) {
      return true;
    }
  }
  return false;
};

/**
 * Return true if the given value is a "target"
 */

utils.isTarget = function(val) {
  if (!utils.isObject(val)) return false;
  if (val.hasOwnProperty('files')) return true;
  if (val.hasOwnProperty('src')) return true;
  if (val.hasOwnProperty('dest')) return true;
  return false;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
