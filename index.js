'use strict';

var define = require('define-property');
var Target = require('expand-target');
var utils = require('expand-utils');
var use = require('use');

/**
 * Create a new Task with the given `options`
 *
 * ```js
 * var task = new Task({cwd: 'src'});
 * task.addTargets({
 *   site: {src: ['*.hbs']},
 *   blog: {src: ['*.md']}
 * });
 * ```
 * @param {Object} `options`
 * @api public
 */

function Task(options) {
  if (!(this instanceof Task)) {
    return new Task(options);
  }

  utils.is(this, 'task');
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
  utils.run(this, 'task', task);
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
  return this;
};

/**
 * Add a single target to the task, while also normalizing src-dest mappings and
 * expanding glob patterns in the target.
 *
 * ```js
 * task.addTarget('foo', {
 *   src: 'templates/*.hbs',
 *   dest: 'site'
 * });
 *
 * // other configurations are possible
 * task.addTarget('foo', {
 *   options: {cwd: 'templates'}
 *   files: [
 *     {src: '*.hbs', dest: 'site'},
 *     {src: '*.md', dest: 'site'}
 *   ]
 * });
 * ```
 * @param {String} `name`
 * @param {Object} `config`
 * @return {Object}
 * @api public
 */

Task.prototype.addTarget = function(name, config) {
  if (typeof name !== 'string') {
    throw new TypeError('expected a string');
  }
  if (!config || typeof config !== 'object') {
    throw new TypeError('expected an object');
  }

  var target = new Target(this.options);
  define(target, '_name', name);

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
