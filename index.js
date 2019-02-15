'use strict'

const fnToStr = require('./lib/fn-to-str')
const escape = require('./lib/escape')

function indent(ln, tabChar) {
  var str = ''
  for (var i = 0; i < ln; i++) str += tabChar
  return str
}

function defaultFnFormatter() {
  return 'function() {}'
}

function simpleFnFormatter(depth, fn) {
  return fnToStr(fn)
}

function mkFnFormatter(tabChar) {
  if (tabChar === undefined) tabChar = '\t'
  return function(tabDepth, fn) {
    var sourced = fnToStr(fn)

    var src = sourced.split('\n')

    // Start by finding the height that the function is currently indented at.
    // I will need this to adjust the indentation.
    var lastLine = src[src.length - 1]

    var currentH = lastLine.match('^(' + tabChar + ')*')[0].length

    // No need to reindent if its already at the proper height.
    if (currentH === tabDepth) {
      return sourced
    }

    // Relying on standard writing style, I shouldn't need to indent the first
    // line.
    var tail = src.slice(1)

    var corrected

    // I need to add indentation.
    if (currentH < tabDepth) {
      var addTabs = tabDepth - currentH
      corrected = tail.map(function(line) {
        return indent(addTabs, tabChar)
      })
    } else {
      // remove indentation.
      var removeChars = currentH - tabDepth
      corrected = tail.map(function(line) {
        return line.substring(removeChars)
      })
    }
    return src[0] + '\n' + corrected.join('\n')
  }
}

function shouldQuote(key) {
  return !/^[a-z0-9_]+$/i.test(key)
}

function objectToSource(data, tabDepth, enclose, options) {
  const { tabChar, quoteChar } = options
  var objListing = Object.keys(data).map(function(key) {
    var sourced = toSource(data[key], tabDepth + 1, true, options)

    var literalKey = shouldQuote(key)
      ? quoteChar + escape(key) + quoteChar
      : key

    var base = indent(tabDepth + 1, tabChar) + literalKey + ': '
    return base + sourced
  })

  var inner = objListing.join(',\n')
  if (options.trailingComma) {
    inner += ',\n'
  }
  if (enclose) {
    return '{\n' + inner + '\n' + indent(tabDepth, tabChar) + '}'
  } else {
    return inner
  }
}

function arrayToSource(data, tabDepth, enclose, options) {
  const tabChar = options.tabChar
  var inner = data
    .map(function(part) {
      var src = toSource(part, tabDepth + 1, true, options)
      return indent(tabDepth + 1, tabChar) + src
    })
    .join(',\n')

  if (options.trailingComma) {
    inner += ',\n'
  }

  if (enclose) {
    return '[\n' + inner + '\n' + indent(tabDepth, tabChar) + ']'
  } else {
    return inner
  }
}

function toSource(data, tabDepth, enclose, options) {
  const quoteChar = options.quoteChar
  switch (typeof data) {
    case 'function':
      return options.functionFormatter(tabDepth, data)
    case 'number':
    case 'undefined':
    case 'boolean':
      return '' + data
    case 'string':
      return quoteChar + escape(data, quoteChar) + quoteChar
    case 'object':
      if (Array.isArray(data)) {
        return arrayToSource(data, tabDepth, enclose, options)
      } else if (data === null) {
        // null is an object lol.
        return 'null'
      } else if (data instanceof Date) {
        return 'new Date(' + data.getTime() + ')'
      } else if (data instanceof RegExp) {
        return data.toString()
      } else {
        return objectToSource(data, tabDepth, enclose, options)
      }
  }
}

// Wrap the toSource function to add in defaults.
module.exports = function(data, options) {
  options = Object.assign(
    {
      trailingComma: false,
      tabDepth: 0,
      enclose: true,
      tabChar: '\t',
      quoteChar: "'",
      functionFormatter: module.exports.defaultFnFormatter
    },
    options || {}
  )

  if (
    options.quoteChar &&
    options.quoteChar !== "'" &&
    options.quoteChar !== '"'
  ) {
    throw new Error('Unsupported quote character ' + options.quoteChar)
  }
  return toSource(data, options.tabDepth, options.enclose, options)
}

module.exports.defaultFnFormatter = defaultFnFormatter
module.exports.mkFnFormatter = mkFnFormatter
module.exports.simpleFnFormatter = simpleFnFormatter
