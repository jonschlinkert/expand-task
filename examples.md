# Valid task patterns

## files-object mappings

> expands "files-objects" into src-dest mappings

```js
task('assemble', {
  site: {
    files: {
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    }
  },
  docs: {
    options: {
      expand: true
    },
    files: {
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    }
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    site: {
      options: {},
      files: [
        {
          src: [
            'test/fixtures/a.txt',
            'test/fixtures/b.txt',
            'test/fixtures/c.txt',
            'test/fixtures/d.txt'
          ],
          dest: 'foo/'
        },
        {
          src: [
            'test/fixtures/a.txt',
            'test/fixtures/b.txt',
            'test/fixtures/c.txt',
            'test/fixtures/d.txt'
          ],
          dest: 'bar/'
        }
      ]
    },
    docs: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a.txt'],
          dest: 'foo/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'foo/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'foo/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'foo/test/fixtures/d.txt'
        },
        {
          src: ['test/fixtures/a.txt'],
          dest: 'bar/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'bar/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'bar/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'bar/test/fixtures/d.txt'
        }
      ]
    }
  }
}
```

## process templates

> Resolve templates in configuration values:

```js
task('jshint', {
  main: 'lib',
  options: {
    process: true
  },
  foo: {
    src: ['<%= jshint.main %>/*.js']
  }
});
```

**results in**

```js
{
  options: {
    process: true
  },
  targets: {
    foo: {
      options: {
        process: true
      },
      files: [
        {
          task: 'jshint',
          target: 'foo',
          src: [],
          options: {
            process: true
          }
        }
      ]
    }
  },
  main: 'lib'
}
```

and...


```js
task('concat', {
  bar: {
    options: {
      process: true
    },
    src: ['<%= jshint.main %>/*.js'],
    dest: 'dest/foo.js'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    bar: {
      options: {
        process: true
      },
      files: [
        {
          task: 'concat',
          target: 'bar',
          src: [],
          dest: 'dest/foo.js',
          options: {
            process: true
          }
        }
      ]
    }
  }
}
```

## src-dest file mappings

> expands `src-dest` mappings based on configuration settings

```js
task('jshint', {
  foo: {
    src: [
      'lib/*.js',
      '*.js'
    ]
  },
  bar: {
    src: [
      'test/*.js',
      '*.js'
    ]
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    foo: {
      options: {},
      files: [
        {
          src: [
            'lib/node.js',
            'lib/normalize.js',
            'lib/reserved.js',
            'lib/utils.js',
            'index.js'
          ]
        }
      ]
    },
    bar: {
      options: {},
      files: [
        {
          src: [
            'test/test.js',
            'index.js'
          ]
        }
      ]
    }
  }
}
```

and...


```js
task('concat', {
  bar: {
    src: [
      'index.js',
      'lib/*.js'
    ],
    dest: 'dest/foo.js'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    bar: {
      options: {},
      files: [
        {
          src: [
            'index.js',
            'lib/node.js',
            'lib/normalize.js',
            'lib/reserved.js',
            'lib/utils.js'
          ],
          dest: 'dest/foo.js'
        }
      ]
    }
  }
}
```

## creates targets

> attempts to create a target with an automatically generated name when `src` exists on an immediate object.

```js
task('foo', {
  src: ['*.js'],
  dest: 'dist/'
});
```

**results in**

```js
{
  options: {},
  targets: {
    foo0: {
      options: {},
      files: [
        {
          src: ['index.js'],
          dest: 'dist/'
        }
      ]
    }
  }
}
```

> expands `src` glob patterns with `dest` and `cwd`:

```js
task('concat', {
  dist: {
    src: [
      '*.js',
      'lib/*.js'
    ],
    dest: 'dist/output.js'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    dist: {
      options: {},
      files: [
        {
          src: [
            'index.js',
            'lib/node.js',
            'lib/normalize.js',
            'lib/reserved.js',
            'lib/utils.js'
          ],
          dest: 'dist/output.js'
        }
      ]
    }
  }
}
```


```js
task('jshint', {
  src: [
    '*.js',
    'lib/*.js'
  ],
  dest: [
    'dist/output.js'
  ]
});
```

**results in**

```js
{
  options: {},
  targets: {
    jshint0: {
      options: {},
      files: [
        {
          src: [
            'index.js',
            'lib/node.js',
            'lib/normalize.js',
            'lib/reserved.js',
            'lib/utils.js'
          ],
          dest: [
            'dist/output.js'
          ]
        }
      ]
    }
  }
}
```

> uses a `cwd` to expand `src` glob patterns:

```js
task('clean', {
  lib: {
    src: '*.txt',
    options: {
      cwd: 'test/fixtures'
    }
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    lib: {
      options: {
        cwd: 'test/fixtures'
      },
      files: [
        {
          src: [
            'a.txt',
            'b.txt',
            'c.txt',
            'd.txt'
          ]
        }
      ]
    }
  }
}
```

## options.expand




> does not prepend `cwd` to created `dest` mappings:

```js
task('verb', {
  options: {
    cwd: 'test/fixtures/',
    expand: true
  },
  src: '*.txt'
});
```

**results in**

```js
{
  options: {},
  targets: {
    verb0: {
      options: {
        cwd: 'test/fixtures/',
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a.txt'],
          dest: 'a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'd.txt'
        }
      ]
    }
  }
}
```

> expands `src` paths to src-dest mappings:

```js
task('verb', {
  src: '*.txt',
  options: {
    cwd: 'test/fixtures',
    expand: true
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    verb1: {
      options: {
        cwd: 'test/fixtures',
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a.txt'],
          dest: 'a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'd.txt'
        }
      ]
    }
  }
}
```

## files objects:

> expands files objects when `expand` is on task options:

```js
task('assemble', {
  options: {
    expand: true
  },
  blog: {
    files: {
      'archives/': 'test/fixtures/*.txt',
      'blog/': 'test/fixtures/*.txt'
    }
  }
});
```

**results in**

```js
{
  options: {
    expand: true
  },
  targets: {
    blog: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a.txt'],
          dest: 'archives/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'archives/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'archives/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'archives/test/fixtures/d.txt'
        },
        {
          src: ['test/fixtures/a.txt'],
          dest: 'blog/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'blog/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'blog/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'blog/test/fixtures/d.txt'
        }
      ]
    }
  }
}
```

> expands files objects when `expand` is on target options:

```js
task('assemble', {
  blog: {
    options: {
      expand: true
    },
    files: {
      'archives/': 'test/fixtures/*.txt',
      'blog/': 'test/fixtures/*.txt'
    }
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    blog: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a.txt'],
          dest: 'archives/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'archives/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'archives/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'archives/test/fixtures/d.txt'
        },
        {
          src: ['test/fixtures/a.txt'],
          dest: 'blog/test/fixtures/a.txt'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'blog/test/fixtures/b.txt'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'blog/test/fixtures/c.txt'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'blog/test/fixtures/d.txt'
        }
      ]
    }
  }
}
```

## options.flatten:

> flattens dest paths:

```js
task('assemble', {
  site: {
    options: {
      expand: true,
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
  targets: {
    site: {
      options: {
        expand: true,
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
}
```

> does not flatten `dest` paths when `flatten` is false

```js
task('assemble', {
  blog: {
    options: {
      expand: true,
      flatten: false
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
  targets: {
    blog: {
      options: {
        expand: true,
        flatten: false
      },
      files: [
        {
          src: ['test/fixtures/a/a.txt'],
          dest: 'dest/test/fixtures/a/a.txt'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'dest/test/fixtures/a/aa/aa.txt'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
        }
      ]
    }
  }
}
```

> does not flatten `dest` paths when `flatten` is undefined:

```js
task('assemble', {
  docs: {
    options: {
      expand: true
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
  targets: {
    docs: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a/a.txt'],
          dest: 'dest/test/fixtures/a/a.txt'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'dest/test/fixtures/a/aa/aa.txt'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
        }
      ]
    }
  }
}
```

## trailing slashes:

> uses `dest` with or without trailing slash:

```js
task('assemble', {
  site: {
    options: {
      expand: true
    },
    src: ['test/fixtures/a/**/*.txt'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    site: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a/a.txt'],
          dest: 'dest/test/fixtures/a/a.txt'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'dest/test/fixtures/a/aa/aa.txt'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
        }
      ]
    }
  }
}
```

and...


```js
task('assemble', {
  docs: {
    options: {
      expand: true
    },
    src: ['test/fixtures/a/**/*.txt'],
    dest: 'dest/'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    docs: {
      options: {
        expand: true
      },
      files: [
        {
          src: ['test/fixtures/a/a.txt'],
          dest: 'dest/test/fixtures/a/a.txt'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'dest/test/fixtures/a/aa/aa.txt'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
        }
      ]
    }
  }
}
```

> flattens `dest` paths by joining pre-dest to src filepath:

```js
task('assemble', {
  styleguide: {
    options: {
      expand: true,
      flatten: true
    },
    src: ['test/fixtures/a/**/*.txt'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    styleguide: {
      options: {
        expand: true,
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
}
```

## options.ext:

> uses the specified extension on dest files:

```js
task('assemble', {
  components: {
    options: {
      expand: true,
      ext: '.foo'
    },
    src: ['test/fixtures/**/foo.*/**'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    components: {
      options: {
        expand: true,
        ext: '.foo'
      },
      files: [
        {
          src: ['test/fixtures/foo.bar'],
          dest: 'dest/test/fixtures/foo.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux'],
          dest: 'dest/test/fixtures/foo.bar/baz.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/foo'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
        }
      ]
    }
  }
}
```

> uses extension when it is an empty string:

```js
task('verb', {
  docs: {
    options: {
      expand: true,
      ext: ''
    },
    src: ['test/fixtures/a/**/*.txt'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    docs: {
      options: {
        expand: true,
        ext: ''
      },
      files: [
        {
          src: ['test/fixtures/a/a.txt'],
          dest: 'dest/test/fixtures/a/a'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'dest/test/fixtures/a/aa/aa'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'dest/test/fixtures/a/aa/aaa/aaa'
        }
      ]
    }
  }
}
```

## options.extDot:

> when `extDot` is `first`, everything after the first dot in the filename is replaced:

```js
task('verb', {
  apidocs: {
    options: {
      expand: true,
      ext: '.foo',
      extDot: 'first'
    },
    src: ['test/fixtures/foo.*/**'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    apidocs: {
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'first'
      },
      files: [
        {
          src: ['test/fixtures/foo.bar'],
          dest: 'dest/test/fixtures/foo.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux'],
          dest: 'dest/test/fixtures/foo.bar/baz.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/foo'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
        }
      ]
    }
  }
}
```

> when `extDot` is `last`, everything after the last dot in the filename is replaced:

```js
task('assemble', {
  multivariate: {
    options: {
      expand: true,
      ext: '.foo',
      extDot: 'last'
    },
    src: ['test/fixtures/foo.*/**'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    multivariate: {
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'last'
      },
      files: [
        {
          src: ['test/fixtures/foo.bar'],
          dest: 'dest/test/fixtures/foo.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux'],
          dest: 'dest/test/fixtures/foo.bar/baz.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.y.foo'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/foo'],
          dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
        }
      ]
    }
  }
}
```

## options.cwd:

> when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:

```js
task('assemble', {
  ab_test: {
    options: {
      expand: true,
      cwd: 'a'
    },
    src: ['test/fixtures/**/*.txt'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    ab_test: {
      options: {
        expand: true,
        cwd: 'a'
      },
      files: [
        {
          task: 'assemble',
          target: 'ab_test',
          src: [],
          dest: 'dest',
          options: {
            expand: true,
            cwd: 'a'
          }
        }
      ]
    }
  }
}
```

## options.rename:

> supports custom rename function:

```js
task('assemble', {
  docs: {
    options: {
      expand: true,
      flatten: true,
      cwd: 'a',
      rename: function (dest, fp, options) {
        return path.join(dest, options.cwd, 'foo', fp);
      }
    },
    src: ['test/fixtures/**/*.txt'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    docs: {
      options: {
        expand: true,
        flatten: true,
        cwd: 'a',
        rename: function (dest, fp, options) {
          return path.join(dest, options.cwd, 'foo', fp);
        }
      },
      files: [
        {
          task: 'assemble',
          target: 'docs',
          src: [],
          dest: 'dest',
          options: {
            expand: true,
            flatten: true,
            cwd: 'a',
            rename: function (dest, fp, options) {
              return path.join(dest, options.cwd, 'foo', fp);
            }
          }
        }
      ]
    }
  }
}
```

> exposes target properties as `this` to the rename function:

```js
task('assemble', {
  archives: {
    options: {
      expand: true,
      filter: 'isFile',
      permalink: ':dest/:upper(basename)',
      upper: function (str) {
        return str.toUpperCase();
      },
      rename: function (dest, fp, options) {
              var pattern = options.permalink;
              var ctx = merge({}, this, options, {
                dest: dest
              });
              ctx.ext = ctx.extname;
              return expand(pattern, ctx, {
                regex: /:([(\w ),]+)/
              });
            }
    },
    src: ['test/fixtures/**/*'],
    dest: 'foo/bar'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    archives: {
      options: {
        expand: true,
        filter: 'isFile',
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        },
        rename: function (dest, fp, options) {
              var pattern = options.permalink;
              var ctx = merge({}, this, options, {
                dest: dest
              });
              ctx.ext = ctx.extname;
              return expand(pattern, ctx, {
                regex: /:([(\w ),]+)/
              });
            }
      },
      files: [
        {
          src: [
            'test/fixtures/a.txt',
            'test/fixtures/a/a.txt'
          ],
          dest: 'foo/bar/A.TXT'
        },
        {
          src: ['test/fixtures/a/aa/aa.txt'],
          dest: 'foo/bar/AA.TXT'
        },
        {
          src: ['test/fixtures/a/aa/aaa/aaa.txt'],
          dest: 'foo/bar/AAA.TXT'
        },
        {
          src: ['test/fixtures/b.txt'],
          dest: 'foo/bar/B.TXT'
        },
        {
          src: ['test/fixtures/b/alpha.js'],
          dest: 'foo/bar/ALPHA.JS'
        },
        {
          src: ['test/fixtures/b/beta.js'],
          dest: 'foo/bar/BETA.JS'
        },
        {
          src: ['test/fixtures/b/gamma.js'],
          dest: 'foo/bar/GAMMA.JS'
        },
        {
          src: ['test/fixtures/c.txt'],
          dest: 'foo/bar/C.TXT'
        },
        {
          src: ['test/fixtures/c/apple.coffee'],
          dest: 'foo/bar/APPLE.COFFEE'
        },
        {
          src: ['test/fixtures/c/celery.coffee'],
          dest: 'foo/bar/CELERY.COFFEE'
        },
        {
          src: ['test/fixtures/c/walnut.coffee'],
          dest: 'foo/bar/WALNUT.COFFEE'
        },
        {
          src: ['test/fixtures/d.txt'],
          dest: 'foo/bar/D.TXT'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
          dest: 'foo/bar/X.Y.Z'
        },
        {
          src: ['test/fixtures/foo.bar/baz.qux/foo'],
          dest: 'foo/bar/FOO'
        },
        {
          src: ['test/fixtures/one.md'],
          dest: 'foo/bar/ONE.MD'
        },
        {
          src: ['test/fixtures/three.md'],
          dest: 'foo/bar/THREE.MD'
        },
        {
          src: ['test/fixtures/two.md'],
          dest: 'foo/bar/TWO.MD'
        },
        {
          src: ['test/fixtures/x.js'],
          dest: 'foo/bar/X.JS'
        },
        {
          src: ['test/fixtures/y.js'],
          dest: 'foo/bar/Y.JS'
        },
        {
          src: ['test/fixtures/z.js'],
          dest: 'foo/bar/Z.JS'
        }
      ]
    }
  }
}
```

> expanded `src` arrays are grouped by dest paths:

```js
task('assemble', {
  site: {
    options: {
      expand: true,
      flatten: true,
      cwd: '',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: ['test/fixtures/{a,b}/**/*'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    site: {
      options: {
        expand: true,
        flatten: true,
        cwd: '',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      files: [
        {
          src: [
            'test/fixtures/a/a.txt',
            'test/fixtures/a/aa/aa.txt',
            'test/fixtures/a/aa/aaa/aaa.txt'
          ],
          dest: 'dest/all.txt'
        },
        {
          src: [
            'test/fixtures/a/aa',
            'test/fixtures/a/aa/aaa'
          ],
          dest: 'dest/all'
        },
        {
          src: [
            'test/fixtures/b/alpha.js',
            'test/fixtures/b/beta.js',
            'test/fixtures/b/gamma.js'
          ],
          dest: 'dest/all.js'
        }
      ]
    }
  }
}
```

> supports filtering by `fs.lstat` type: `.isDirectory()`

```js
task('assemble', {
  showcase: {
    options: {
      expand: true,
      flatten: true,
      filter: 'isDirectory',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: ['test/fixtures/{a,b}/**/*'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    showcase: {
      options: {
        expand: true,
        flatten: true,
        filter: 'isDirectory',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      files: [
        {
          src: [
            'test/fixtures/a/aa',
            'test/fixtures/a/aa/aaa'
          ],
          dest: 'dest/all'
        }
      ]
    }
  }
}
```

> supports filtering by `fs.lstat` type: `.isFile()`

```js
task('assemble', {
  marketing: {
    options: {
      expand: true,
      flatten: true,
      filter: 'isFile',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: ['test/fixtures/{a,b}/**/*'],
    dest: 'dest'
  }
});
```

**results in**

```js
{
  options: {},
  targets: {
    marketing: {
      options: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      files: [
        {
          src: [
            'test/fixtures/a/a.txt',
            'test/fixtures/a/aa/aa.txt',
            'test/fixtures/a/aa/aaa/aaa.txt'
          ],
          dest: 'dest/all.txt'
        },
        {
          src: [
            'test/fixtures/b/alpha.js',
            'test/fixtures/b/beta.js',
            'test/fixtures/b/gamma.js'
          ],
          dest: 'dest/all.js'
        }
      ]
    }
  }
}
```
