const assert = require('assert').strict
var toSource = require('../index')

describe('complex types (arrays and objects)', function() {
  'use strict'

  const contains = (value, expected) => {
    assert(
      value.indexOf(expected) > -1,
      `Expected ${value} to contain ${expected}`
    )
  }

  it('will output simple structures with functioning defaults', function() {
    var simple = {
      a: 2,
      b: [1, 2, 3]
    }
    var output = toSource(simple)
    contains(output, 'a')
    contains(output, '[')
    contains(output, 'b')
  })

  it('trailing object', function() {
    var trails = { a: 1 }
    var output = toSource(trails, { trailingComma: true })
    contains(output, '1,\n}')
  })

  it('trailing array', function() {
    var trails = [1]
    var output = toSource(trails, { trailingComma: true })
    contains(output, '1,\n]')
  })

  it('outputs nested objects', function() {
    var nested = {
      a: {
        b: {
          c: {
            d: 2
          }
        }
      }
    }
    var output = toSource(nested)
    contains(output, 'c: {')
    contains(output, 'd: 2')
  })

  it('outputs arrays containing objects', function() {
    var objarr = [
      { a: 1 },
      { b: 2 },
      {
        c: {
          d: 3
        }
      }
    ]
    var output = toSource(objarr)
    contains(output, 'a: 1')
    contains(output, '},\n')
    contains(output, 'd')
  })

  it('should be possible to output without the closing brackets', function() {
    var obj = {
      a: 1,
      b: {
        c: 2
      }
    }
    var output = toSource(obj, { tabDepth: -1, enclose: false })
    assert(output.indexOf('{\n\ta') === -1)
    contains(output, '\tc')
  })

  it('supports trailing commas', function() {
    const obj = {
      one: ['two', 'three'],
      four: 'five'
    }
    const output = toSource(obj, {
      trailingComma: true
    })
    contains(output, `four: 'five',`)
    contains(output, `'three',`)
  })

  it('empty trailing', function() {
    let output = toSource({}, { trailingComma: true })
    assert.throws(() => {
      contains(output, ',')
    })
    output = toSource([], { trailingComma: true })
    assert.throws(() => {
      contains(output, ',')
    })
  })

  it('escapes keys prefixed with a number', function() {
    let output = toSource({ '1_test': 'foobar' })
    contains(output, `'1_test'`)
  })
})
