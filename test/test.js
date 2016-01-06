'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Task = require('..');
var task;

describe('tasks', function() {
  beforeEach(function() {
    task = new Task();
  });

  describe('targets', function() {
    it('should expose an "options" property', function() {
      task.addTargets({});
      assert(task.options);
    });

    it('should expose an addTargets method', function() {
      assert.equal(typeof task.addTargets, 'function');
    });

    it('should add targets to `task`', function() {
      task.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(task.foo);
      assert(task.bar);
    });

    it('should expand src patterns in targets', function() {
      task.addTargets({
        foo: {src: '*.md'},
        bar: {src: '*.js'}
      });
      assert(Array.isArray(task.foo.files));
      assert(Array.isArray(task.foo.files[0].src));
      assert(task.foo.files[0].src.length);
    });

    it('should use task options on targets', function() {
      task.addTargets({
        options: {cwd: 'test/fixtures'},
        foo: {src: 'a.*'},
        bar: {src: 'one.*'}
      });
      assert(task.foo.files[0].src[0] === 'a.txt');
      assert(task.bar.files[0].src[0] === 'one.md');
    });

    it('should retain arbitrary properties on targets', function() {
      task.addTargets({
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });
      assert(task.foo.files[0].data);
      assert(task.foo.files[0].data.title);
      assert(task.foo.files[0].data.title === 'My Blog');
    });

    it('should use plugins on targets', function() {
      task.use(function(config) {
        return function fn(node) {
          if (config.options.data && !node.data) {
            node.data = config.options.data;
          }
          return fn;
        }
      });

      task.addTargets({
        options: {data: {title: 'My Site'}},
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });

      assert(task.foo.files[0].data);
      assert(task.foo.files[0].data.title);
      assert(task.foo.files[0].data.title === 'My Blog');

      assert(task.bar.options.data);
      assert(task.bar.options.data.title === 'My Site');
      assert(task.bar.files[0].data);
      assert(task.bar.files[0].data.title);
      assert(task.bar.files[0].data.title === 'My Site');
    });
  });
});
