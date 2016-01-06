'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Module dependencies
 */

require('define-property', 'define');
require('expand-target', 'Target');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
