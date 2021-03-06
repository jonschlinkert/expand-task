# expand-task [![NPM version](https://img.shields.io/npm/v/expand-task.svg)](https://www.npmjs.com/package/expand-task)

> Expand and normalize task definitions in a declarative configuration.

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
  * [More info](#more-info)
- [Options](#options)
  * [options properties](#options-properties)
- [Related projects](#related-projects)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

Take a look at the [examples](./examples.md)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm i expand-task --save
```

## Usage

```js
var Task = require('expand-task');
```

## Examples

Write declarative "task" definitions similar to the config-style used by [grunt](http://gruntjs.com/).

```js
var task = new Task({
  options: {cwd: 'src'},
  site: {
    src: 'templates/*.hbs',
    dest: 'site/'
  },
  blog: {
    src: 'content/*.md',
    dest: 'site/blog/'
  }
});
```

**Add targets**

The `options` object is automatically recognized and will not be turned into a target.

```js
var task = new Task();

task.addTargets({
  options: {cwd: 'src'},
  site: {
    src: 'templates/*.hbs',
    dest: 'site/'
  },
  blog: {
    src: 'content/*.md',
    dest: 'site/blog/'
  }
});
```

**Add a single target**

```js
task.addTarget('docs', {
  options: {
    mapDest: true
  },
  src: ['test/fixtures/a/**/*.txt'],
  dest: 'dest/'
});
```

> flattens dest paths:

```js
task('assemble', {
  site: {
    options: {
      mapDest: true,
      flatten: true
    },
    src: 'test/fixtures/a/**/*.txt',
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  site: {
    options: {
      mapDest: true,
      flatten: true
    },
    files: [
      {
        src: ['test/fixtures/a/a.txt'],
        dest: 'dest/a.txt'
      },
      {
        src: ['test/fixtures/a/aa/aa.txt'],
        dest: 'dest/aa.txt'
      },
      {
        src: ['test/fixtures/a/aa/aaa/aaa.txt'],
        dest: 'dest/aaa.txt'
      }
    ]
  }
}
```

### More info

Take a look at [examples.md](./examples.md), it shows lots of different ways to define tasks.

Also:

* Visit [expand-target](https://github.com/jonschlinkert/expand-target) for the full range of `target` options and documentation.
* Visit [expand-files][] for the full range of `files` options and documentation.

## Options

Any option from [expand-files][] may be used. Please see that project for the full range of options and documentation.

### options properties

The below "special" properties are fine to use either on an `options` object or on the root of the object passed to `expand-files`.

Either way they will be normalized onto the `options` object to ensure that [globby][] and consuming libraries are passed the correct arguments.

**special properties**

* `base`
* `cwd`
* `destBase`
* `mapDest`
* `ext`
* `extDot`
* `extend`
* `flatten`
* `rename`
* `process`
* `srcBase`

**example**

Both of the following will result in `mapDest` being on the `options` object.

```js
files({src: '*.js', dest: 'dist/', options: {mapDest: true}});
files({src: '*.js', dest: 'dist/', mapDest: true});
```

## Related projects

* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and files in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/expand-task/issues/new).

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016 [Jon Schlinkert](https://github.com/jonschlinkert)
Released under the MIT license.

***

_This file was generated by [verb](https://github.com/verbose/verb) on January 06, 2016._