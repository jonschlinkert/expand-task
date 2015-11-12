'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Task = require('..');
var task;

describe('tasks', function () {
  beforeEach(function() {
    task = new Task();
  });

  describe('targets', function () {
    it('should expose an "options" property', function () {
      task.expand({});
      assert(task.options);
    });

    it('should expose targets', function () {
      task.expand({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(task.foo);
      assert(task.bar);
    });
  });
});
