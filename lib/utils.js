'use strict';

var typeOf = require('kind-of');
var reserved = require('./reserved');
var cache = {};

/**
 * Expose `utils`
 */

var utils = module.exports;

utils.nextId = function nextId(key) {
  if (!cache.hasOwnProperty(key)) cache[key] = 0;
  return key + cache[key]++;
};

utils.has = function has(value, key) {
  if (typeof key === 'undefined') return false;
  if ((Array.isArray(value) || isString(value)) && isString(key)) {
    return value.indexOf(key) > -1;
  }
  if (isObject(value) && isString(key)) {
    return key in value;
  }
  if (typeof value === 'object' && Array.isArray(key)) {
    var len = key.length;
    while (len--) {
      var val = key[len];
      if (utils.has(value, val)) return true;
    }
    return false;
  }
};

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
};

function isTargetKey(key) {
  return utils.has(reserved.targetKeys, key);
}

utils.isTarget = function isTarget(val, key) {
  if (key && isTargetKey(key)) {
    return true;
  }
  if (!utils.isObject(val)) return false;
  if (utils.has(val, reserved.targetKeys)) {
    return true;
  }
  return false;
};

utils.isNode = function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
};

function isObject(val) {
  return typeOf(val) === 'object';
}

function isString(val) {
  return typeOf(val) === 'string';
}


exports.isString = isString;
exports.isObject = isObject;
