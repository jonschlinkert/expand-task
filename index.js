'use strict';

var forIn = require('for-in');
var clone = require('clone-deep');
var Target = require('expand-target');
var normalize = require('./lib/normalize');
var utils = require('./lib/utils');
var Node = require('./lib/node');

function Task(name, config, parent) {
  if (!(this instanceof Task)) {
    return new Task(name, config, parent);
  }
  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = null;
  }
  var root = parent ? (parent.root || parent.orig) : this.orig;
  // Inherit `Node`
  Node.call(this, null, parent, root || this);
  // clone the original config object
  this.define('orig', clone(config || {}));
  // set the task name, or generate an id
  this.define('name', name || config.name || utils.nextId('task'));
  this.options = {};
  this.targets = {};
  // normalize the config object
  this.normalize(config || {}, parent);
}
Node.extend(Task);


Task.prototype.normalize = function(config, parent) {
  config = config || {};

  if (utils.isTarget(config)) {
    var name = utils.nextId(this.name || 'target');
    var task = {};
    task[name] = config;
    config = task;
  }

  config = normalize('task', this)(config, parent);

  forIn(config, function (val, key) {
    if (utils.isTarget(val, key)) {
      this.targets[key] = new Target(key, val, this);

    } else if (utils.isNode(val, key)) {
      this.set(key, new Node(val, this));

    } else {
      this.set(key, val);
    }
  }, this);
};


Task.prototype.getTarget = function(name) {
  return this.targets[name];
};


Task.prototype.toConfig = function() {
  var res = {};
  forIn(this.targets, function (val, key) {
    res[key] = val;
  });
  return res;
};


/**
 * Expose `Task`
 */

module.exports = Task;
