'use strict';

var path = require('path');
var merge = require('mixin-deep');
var expand = require('expand');

module.exports = [{
  section: 'files-object mappings',
  examples: [{
    description: 'expands "files-objects" into src-dest mappings',
    config: [{
      assemble: {
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
      }
    }]
  }]
}, {
  section: 'process templates',
  examples: [{
    description: 'Resolve templates in configuration values:',
    config: [{
      jshint: {
        main: 'lib',
        options: {process: true},
        foo: {
          src: ['<%= jshint.main %>/*.js']
        }
      }
    }, {
      concat: {
        bar: {
          options: {process: true},
          src: ['<%= jshint.main %>/*.js'],
          dest: 'dest/foo.js',
        }
      }
    }]
  }]
}, {
  section: 'src-dest file mappings',
  examples: [{
    description: 'expands `src-dest` mappings based on configuration settings',
    config: [{
      jshint: {
        foo: {
          src: ['lib/*.js', '*.js']
        },
        bar: {
          src: ['test/*.js', '*.js']
        }
      }
    }, {
      concat: {
        bar: {
          src: ['index.js', 'lib/*.js'],
          dest: 'dest/foo.js',
        }
      }
    }]
  }]
}, {
  section: 'creates targets',
  examples: [{
    description: 'attempts to create a target with an automatically generated name when `src` exists on an immediate object.',
    config: [{
      foo: {
        src: ['*.js'],
        dest: 'dist/'
      }
    }]
  }, {
    description: 'expands `src` glob patterns with `dest` and `cwd`:',
    config: [{
      concat: {
        dist: {
          src: ['*.js', 'lib/*.js'],
          dest: 'dist/output.js'
        }
      },
      jshint: {
        src: ['*.js', 'lib/*.js'],
        dest: ['dist/output.js']
      }
    }],
  }, {
    description: 'uses a `cwd` to expand `src` glob patterns:',
    config: [{
      clean: {
        lib: {
        src: '*.txt',
        options: {
          cwd: 'test/fixtures'
        }
      }
      }
    }]
  }],
}, {
  section: 'options.expand',
  examples: [{
    verb: {
      description: 'joins the `cwd` to expanded `src` paths:',
      config: {
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          expand: true
        }
      }
    }
  }, {
    verb: {
      description: 'expands `src` paths into src-dest mappings:',
      config: {
        src: 'test/fixtures/*.txt',
        options: {
          expand: true
        }
      }
    }
  }, {
    verb: {
      description: 'creates `dest` properties using the `src` basename:',
      config: {
        options: {
          expand: true
        },
        src: 'test/fixtures/*.txt'
      }
    }
  }, {
    description: 'does not prepend `cwd` to created `dest` mappings:',
    config: {
      verb: {
        options: {
          cwd: 'test/fixtures/',
          expand: true
        },
        src: '*.txt'
      }
    }
  }, {
    description: 'expands `src` paths to src-dest mappings:',
    config: {
      verb: {
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          expand: true
        }
      }
    }
  }],
}, {
  section: 'files objects:',
  examples: [{
    description: 'expands files objects when `expand` is on task options:',
    config: [{
      assemble: {
        options: {
          expand: true
        },
        blog: {
          files: {
            'archives/': 'test/fixtures/*.txt',
            'blog/': 'test/fixtures/*.txt'
          }
        }
      }
    }]
  }, {
    description: 'expands files objects when `expand` is on target options:',
    config: [{
      assemble: {
        blog: {
          options: {
            expand: true
          },
          files: {
            'archives/': 'test/fixtures/*.txt',
            'blog/': 'test/fixtures/*.txt'
          }
        }
      }
    }]
  }]
}, {
  section: 'options.flatten:',
  examples: [{
    description: 'flattens dest paths:',
    config: [{
      assemble: {
        site: {
          options: {
            expand: true,
            flatten: true
          },
          src: 'test/fixtures/a/**/*.txt',
          dest: 'dest',
        }
      }
    }]
  }, {
    description: 'does not flatten `dest` paths when `flatten` is false',
    config: [{
      assemble: {
        blog: {
          options: {
            expand: true,
            flatten: false
          },
          src: 'test/fixtures/a/**/*.txt',
          dest: 'dest',
        }
      }
    }]
  }, {
    description: 'does not flatten `dest` paths when `flatten` is undefined:',
    config: [{
      assemble: {
        docs: {
          options: {
            expand: true
          },
          src: 'test/fixtures/a/**/*.txt',
          dest: 'dest',
        }
      }
    }]
  }]
}, {
  section: 'trailing slashes:',
  examples: [{
    description: 'uses `dest` with or without trailing slash:',
    config: [{
      assemble: {
        site: {
          options: {
            expand: true
          },
          src: ['test/fixtures/a/**/*.txt'],
          dest: 'dest'
        }
      }
    }, {
      assemble: {
        docs: {
          options: {
            expand: true
          },
          src: ['test/fixtures/a/**/*.txt'],
          dest: 'dest/'
        }
      }
    }]
  }, {
    description: 'flattens `dest` paths by joining pre-dest to src filepath:',
    config: [{
      assemble: {
        styleguide: {
          options: {
            expand: true,
            flatten: true
          },
          src: ['test/fixtures/a/**/*.txt'],
          dest: 'dest'
        }
      }
    }]
  }]
}, {
  section: 'options.ext:',
  examples: [{
    description: 'uses the specified extension on dest files:',
    config: [{
      assemble: {
        components: {
          options: {
            expand: true,
            ext: '.foo'
          },
          src: ['test/fixtures/**/foo.*/**'],
          dest: 'dest'
        }
      }
    }]
  }, {
    description: 'uses extension when it is an empty string:',
    config: [{
      verb: {
        docs: {
          options: {
            expand: true,
            ext: ''
          },
          src: ['test/fixtures/a/**/*.txt'],
          dest: 'dest'
        }
      }
    }]
  }]
}, {
  section: 'options.extDot:',
  examples: [{
    description: 'when `extDot` is `first`, everything after the first dot in the filename is replaced:',
    config: [{
      verb: {
        apidocs: {
          options: {
            expand: true,
            ext: '.foo',
            extDot: 'first'
          },
          src: ['test/fixtures/foo.*/**'],
          dest: 'dest'
        }
      }
    }]
  }, {
    description: 'when `extDot` is `last`, everything after the last dot in the filename is replaced:',
    config: [{
      assemble: {
        multivariate: {
          options: {
            expand: true,
            ext: '.foo',
            extDot: 'last'
          },
          src: ['test/fixtures/foo.*/**'],
          dest: 'dest'
        }
      }
    }]
  }]
}, {
  section: 'options.cwd:',
  examples: [{
    description: 'when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:',
    config: [{
      assemble: {
        ab_test: {
          options: {
            expand: true,
            cwd: 'a'
          },
          src: ['test/fixtures/**/*.txt'],
          dest: 'dest'
        }
      }
    }]
  }]
}, {
  section: 'options.rename:',
  examples: [{
    description: 'supports custom rename function:',
    config: [{
      assemble: {
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
      }

    }]
  }, {
    description: 'exposes target properties as `this` to the rename function:',
    config: [{
      assemble: {
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
      }
    }]
  }, {
    description: 'expanded `src` arrays are grouped by dest paths:',
    config: [{
      assemble: {
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
      }
    }]
  }, {
    description: 'supports filtering by `fs.lstat` type: `.isDirectory()`',
    config: [{
      assemble: {
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
      }
    }]
  }, {
    description: 'supports filtering by `fs.lstat` type: `.isFile()`',
    config: [{
      assemble: {
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
      }
    }]
  }]
}];
