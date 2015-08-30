'use strict';

var Base = require('base-methods');

function Node(config, parent, root) {
  Base.call(this, config || {});
  this.define('parent', parent);
  this.define('root', root);
}

Base.extend(Node);

/**
 * Expose `Node`
 */

module.exports = Node;
