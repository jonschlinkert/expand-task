'use strict';

var forIn = require('for-in');
var expand = require('expand');
var merge = require('mixin-deep');
var reserved = require('./reserved');

/**
 * Normalize options. If a `parent` object exists,
 * and it has an `options` object, it will be used
 * to extend the config.
 */

module.exports = function normalizeOpts(name, current, resv) {
  resv = resv || reserved.options;

  return function(config) {
    config.options = config.options || {};

    forIn(config, function (val, key) {
      if (~resv.indexOf(key)) {
        config.options[key] = config[key];
        delete config[key];
      }
    });

    if (current.parent && current.parent.options) {
      config.options = merge({}, current.parent.options, config.options);
    }

    // resolve templates using the `current` object as context
    var process = config.options.process;
    if (!process) return config;

    var ctx = {};

    // process `<%= foo %>` config templates
    if (process === name) {
      if (name === 'node') {
        config = expand(config);
      }
      ctx = merge({}, current.orig, config);
      config = expand(config, ctx);
    } else if (name === 'node' && process === 'target') {
      config = expand(config, current.orig);
    } else if (name === 'node' && process === 'task') {
      config = expand(config, current.parent.orig);
    } else if (name === 'target' && process === 'task') {
      config = expand(config, current.parent.orig);
    } else if (process === 'all') {
      if (name === 'node') {
        config = expand(config);
      }
      config = expand(config, current.orig);
      config = expand(config, current.parent.orig);
    }

    ctx = merge({}, config, config.options, config.root);
    config = expand(config, ctx);
    return config;
  };
};
