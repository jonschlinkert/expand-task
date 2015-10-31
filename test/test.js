'use strict';

/* deps: mocha */
var util = require('util');
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');
var task = require('..');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('tasks', function () {
  describe('constructor', function () {
    it('should set a task `name` when passed as the first arg.', function () {
      var config = task('foo', {src: 'a', dest: 'b'});
      assert.equal(config.name, 'foo');
    });

    it('should allow arbitrary properties to be defined.', function () {
      var config = task('foo', {
        main: 'whatever',
        assemble: {
          site: {src: 'a', dest: 'b'}
        }
      });
      assert.equal(config.main, 'whatever');
    });

    it('should add a parent property if parent is passed:', function () {
      var config = task('foo', {}, {});
      assert.deepEqual(config.parent, {});
    });

    it('should add multiple targets if passed on the constructor:', function () {
      var config = task({
        foo: {src: 'test/fixtures/*.txt'},
        bar: {src: 'test/fixtures/*.txt'}
      });
      config.targets.should.have.properties('foo', 'bar');
    });
  });

  describe('options', function () {
    it('should move reserved options properties to `options`', function () {
      var config = task({cwd: 'foo'});
      assert.deepEqual(config.options, {cwd: 'foo'});
    });

    it('should merge reserved options properties with `options`', function () {
      var config = task({options: {cwd: 'foo'}, ext: '.bar'});
      assert.deepEqual(config.options, {cwd: 'foo', ext: '.bar'});
    });

    it('should add a non-enumerable `target` name to the target:', function () {
      var config = task('jshint', {
        options: {cwd: 'foo'},
        ext: '.bar',
        cwd: 'foo',
        one: {cwd: 'bar', src: '*.js'}
      });
      config.targets.one.name.should.equal('one');
    });

    it.skip('should separate task options from targets:', function () {
      var config = task('jshint', {
        options: {cwd: 'foo'},
        ext: '.bar',
        cwd: 'foo',
        one: {cwd: 'bar', src: '*.js'},
        two: {cwd: 'baz', src: '*.md'},
      });

      assert.deepEqual(config, {
        options: {cwd: 'foo', ext: '.bar'},
        targets: {
          one: {
            options: {cwd: 'bar', ext: '.bar' },
            files: [{
              task: 'jshint',
              name: 'one',
              src: [],
              options: {cwd: 'bar', ext: '.bar' }
            }]
          },
          two: {
            options: {cwd: 'baz', ext: '.bar' },
            files: [{
              task: 'jshint',
              name: 'two',
              src: [],
              options: {cwd: 'baz', ext: '.bar' }
            }]
          }
        }
      });
    });
  });

  describe('parent', function () {
    it('should extend config.options with config options.', function () {
      var config = {options: {foo: 'bar'}};
      var config = task({src: 'a', dest: 'b'}, config);
      config.should.have.property('options');
      config.options.should.have.property('foo', 'bar');
    });

    it('should not overwrite target.options:', function () {
      var config = {options: {aaa: 'zzz'}};
      var config = task('assemble', {
        site: {
          options: {aaa: 'bbb'},
          src: 'a',
          dest: 'b',
        }
      }, config);

      config.should.have.property('options');
      config.options.should.have.property('aaa', 'zzz');
      config.targets.site.options.should.have.property('aaa', 'bbb');
    });

    it('should not overwrite options on created targets:', function () {
      var config = {options: {foo: 'bar'}};
      var config = task('assemble', {
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, config);

      config.should.have.property('name');
      config.should.have.property('options');
      config.options.should.have.property('foo', 'bar');
    });

    it('should auto-generate target names for anonymous targets:', function () {
      var config = {options: {foo: 'bar'}};
      var config = task('assemble', {
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, config);

      var keys = Object.keys(config.targets);
      keys[0].should.match(/assemble\d/);
      config.targets[keys[0]].options.should.have.property('foo', 'baz');
    });
  });
});
