const vm = require('vm')
const assert = require('assert').strict
const toSource = require('../index')

describe('simple types', function() {
  it('parses strings', function() {
    var str = 'hello world'
    assert.equal(toSource(str, { quoteChar: '"' }), '"hello world"')
    assert.equal(toSource(str), "'hello world'")
  })

  it('escapes single quotes', function() {
    const source = toSource("foo'bar")
    assert.equal(vm.runInNewContext(source), "foo'bar")
    assert.equal(source, "'foo\\'bar'")
  })

  it('escapes double quotes', function() {
    const input = 'foo"bar'
    const source = toSource(input, { quoteChar: '"' })
    assert.equal(vm.runInNewContext(source), input)
    assert.equal(source, '"foo\\"bar"')
  })

  it('handles backslashes', function() {
    const input = "foo\\'bar"
    const source = toSource(input)
    assert.equal(vm.runInNewContext(source), input)
  })

  it('handles double quote backslashes', function() {
    const input = 'foo\\"bar'
    const source = toSource(input)
    assert.equal(vm.runInNewContext(source), input)
  })

  it('handles line breaks', function() {
    const input = 'foo\nbar'
    const source = toSource(input)
    assert.equal(vm.runInNewContext(source), input)
  })

  it('handles carriage returns', function() {
    const input = 'foo\rbar'
    const source = toSource(input)
    assert.equal(vm.runInNewContext(source), input)
  })

  it('parses numbers', function() {
    var n = 1
    assert.equal(toSource(n), '1')
  })

  it('parses undefined', function() {
    assert.equal(toSource(undefined), 'undefined')
    var complex = {
      a: undefined
    }
    assert.equal(toSource(complex), '{\n\ta: undefined\n}')
  })

  it('parses booleans', function() {
    assert.equal(toSource(true), 'true')
    var complex = {
      a: true
    }
    assert.equal(toSource(complex), '{\n\ta: true\n}')
  })

  it('parses dates', function() {
    var d = new Date()
    var sourced = toSource(d)

    // We're using eval for testing purposes, so this isn't a security concern.
    /* eslint no-eval:0 */
    assert.equal(eval(sourced).getTime(), d.getTime())
  })

  it('parses regular expressions', function() {
    var reg = /foobar/
    assert.equal(toSource(reg), '/foobar/')
  })
})
