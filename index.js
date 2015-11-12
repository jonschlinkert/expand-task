'use strict';

var use = require('use');
var utils = require('./utils');
var Target = require('expand-target');

/**
 * Create a new Task with the given `options`
 *
 * ```js
 * var task = new Task({cwd: 'src'});
 * task.expand({
 *   site: {src: '*.hbs', dest: 'templates/'},
 *   docs: {src: '*.md', dest: 'content/'}
 * });
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function Task(options) {
  utils.define(this, '_name', 'Task');
  use(this);

  this.options = options || {};
  if (utils.isTask(options)) {
    this.options = {};
    this.expand(options);
    return this;
  }
}

/**
 * Normalize tasks and src-dest mappings and glob patterns in
 * task targets.
 *
 * @param {Object} `task`
 * @return {Object}
 * @api public
 */

Task.prototype.expand = function(task) {
  for (var key in task) {
    var val = task[key];
    if (utils.isTarget(val)) {
      this.addTarget(key, val);
    } else {
      this[key] = val;
    }
  }
};

/**
 * Add a target to the task.
 *
 * @param {String} `name`
 * @param {Object} `config`
 * @return {Object}
 * @api public
 */

Task.prototype.addTarget = function(name, config) {
  var target = new Target(this.options);
  utils.define(target, 'name', name);

  utils.run(this, 'target', target);
  target.expand(config);

  if (!(name in this)) {
    this[name] = target;
  }
  return target;
};

/**
 * Expose `Task`
 */

module.exports = Task;
