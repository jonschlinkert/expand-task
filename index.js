'use strict';

var utils = require('expand-utils');
var util = require('./utils');
var use = require('use');

/**
 * Create a new Task with the given `options`
 *
 * ```js
 * var task = new Task({cwd: 'src'});
 * ```
 * @param {Object} `options`
 * @api public
 */

function Task(options) {
  util.define(this, '_name', 'Task');
  util.define(this, 'isTask', true);
  use(this);

  this.options = options || {};
  if (utils.isTask(options)) {
    this.options = {};
    this.addTargets(options);
    return this;
  }
}

/**
 * Add targets to the task, while also normalizing src-dest mappings and
 * expanding glob patterns in each target.
 *
 * ```js
 * task.addTargets({
 *   site: {src: '*.hbs', dest: 'templates/'},
 *   docs: {src: '*.md', dest: 'content/'}
 * });
 * ```
 * @param {Object} `task` Task object where each key is a target or `options`.
 * @return {Object}
 * @api public
 */

Task.prototype.addTargets = function(task) {
  for (var key in task) {
    if (task.hasOwnProperty(key)) {
      var val = task[key];
      if (utils.isTarget(val)) {
        this.addTarget(key, val);
      } else {
        this[key] = val;
      }
    }
  }
};

/**
 * Add a single target to the task, while also normalizing src-dest mappings and
 * expanding glob patterns in the target.
 *
 * ```js
 * task.addTarget('foo', {
 *   src: '*.hbs',
 *   dest: 'templates/'
 * });
 * ```
 * @param {String} `name`
 * @param {Object} `config`
 * @return {Object}
 * @api public
 */

Task.prototype.addTarget = function(name, config) {
  if (typeof name !== 'string') {
    throw new TypeError('addTarget expects name to be a string');
  }

  var target = new util.Target(this.options);
  util.define(target, '_name', name);

  utils.run(this, 'target', target);
  target.addFiles(config);

  if (!(name in this)) {
    this[name] = target;
  }
  return target;
};

/**
 * Expose `Task`
 */

module.exports = Task;
