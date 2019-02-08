const assert = require('assert').strict
var toSource = require('../index')
var fnToStr = require('../lib/fn-to-str')

describe('function support', function() {
  const identity = a => {
    return a
  }

  const contains = (value, expected) => {
    assert(
      value.indexOf(expected) > -1,
      `Expected ${value} to contain ${expected}`
    )
  }
  // defaults!
  var formatter = toSource.mkFnFormatter()

  it('should return an empty function by default', function() {
    assert.equal(toSource(identity), 'function() {}')
  })

  it('should use the functionFormatter if specified', function() {
    var options = {
      functionFormatter: function() {
        return 'foobar'
      }
    }
    assert.equal(toSource(identity, options), 'foobar')

    var complex = {
      a: {
        b: identity
      }
    }

    contains(toSource(complex, options), 'foobar')
  })

  it.skip('has a formatter which indents properly', function() {
    var formatted = formatter(1, identity)
    var lines = formatted.split('\n')

    contains(formatted, 'return')
    contains(lines[1], '\t\t')
    assert(lines[0].indexOf('\t') === -1)
  })

  it.skip('should format inside an object properly', function() {
    var obj = {
      foo: {
        bar: function() {
          return 'foobar!'
        }
      }
    }

    var sourced = toSource(obj, {
      functionFormatter: formatter
    })

    assert(/^\t{2}[}]/.test(sourced.split('\n')[4]))
  })

  it('should be able to detect which functions are native', function() {
    var isNative = fnToStr.isNativeFn
    assert(isNative(Date.now))
    assert(!isNative(function() {}))
    assert(isNative(Math.log))
  })

  it('should be able to output native functions', function() {
    assert.equal(fnToStr(Math.log), 'Math.log')
    assert.equal(fnToStr(Object.defineProperty), 'Object.defineProperty')

    var sourced = toSource(Object.keys, {
      functionFormatter: formatter
    })
    contains(sourced, 'Object.keys')
  })
})
