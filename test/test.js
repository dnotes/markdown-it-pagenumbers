'use strict'

// TODO: these are parsed incorrectly:
//
// ~~~foo~~~
// ~~~foo~ bar~~



var path     = require('path')
var generate = require('markdown-it-testgen')

/*eslint-env mocha*/

describe('markdown-it-pagenumbers', function () {
  var md = require('markdown-it')().use(require('../'))
  generate(path.join(__dirname, 'fixtures/definitions.txt'), md)
})
