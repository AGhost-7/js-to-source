'use strict'

var fnToStr = require('./lib/fn-to-str')

function tabs(ln, tabChar) {
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
        return tabs(addTabs, tabChar)
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

const singleQuoteReg = new RegExp("'", 'g')
const doubleQuoteReg = new RegExp('"', 'g')
const backslashReg = new RegExp('[\\\\]', 'g')

function escape(str, quoteChar) {
  let escaped = str
    .replace(backslashReg, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')

  if (quoteChar === "'") {
    escaped = escaped.replace(singleQuoteReg, "\\'")
  } else {
    escaped = escaped.replace(doubleQuoteReg, '\\"')
  }
  return escaped
}

function shouldQuote(key) {
  return !/^[a-z0-9_]+$/i.test(key)
}

function objectToSource(
  data,
  tabDepth,
  brackets,
  tabChar,
  quoteChar,
  functionFormatter
) {
  var objListing = Object.keys(data).map(function(key) {
    var sourced = toSource(
      data[key],
      tabDepth + 1,
      true,
      tabChar,
      quoteChar,
      functionFormatter
    )

    var literalKey = shouldQuote(key)
      ? quoteChar + escape(key) + quoteChar
      : key

    var base = tabs(tabDepth + 1, tabChar) + literalKey + ': '
    return base + sourced
  })

  var inner = objListing.join(',\n')
  if (brackets) {
    return '{\n' + inner + '\n' + tabs(tabDepth, tabChar) + '}'
  } else {
    return inner
  }
}

function arrayToSource(
  data,
  tabDepth,
  brackets,
  tabChar,
  quoteChar,
  functionFormatter
) {
  var inner = data
    .map(function(part) {
      var src = toSource(
        part,
        tabDepth + 1,
        true,
        tabChar,
        quoteChar,
        functionFormatter
      )
      return tabs(tabDepth + 1, tabChar) + src
    })
    .join(',\n')

  if (brackets) {
    return '[\n' + inner + '\n' + tabs(tabDepth, tabChar) + ']'
  } else {
    return inner
  }
}

/**
 * Turns code back into source! Doesn't support functions or comments though.
 *
 * @param {string} data; This is the javascript value to convert back into source text.
 * @param {number} tabDepth; Is the indentation level that the value is starting at.
 * @param {boolean} brackets; If false, the object output won't have the openeing and closing
 * brackets. This is useful is you want to insert the output into an existing object.
 * @param {string} tabChar; specifies what to use for the height character. By default this will
 * use a single tab character. You can specify two, three, four spaces instead if you want (or
 * whatever you want).
 * @param {function} functionFormatter; If you want to parse functions, you will need to specify
 * this argument. The function will feed the tab height and the function object to the
 * formatter, from there you will need to source it and change the format to preference. If this
 * argument is not specified the default will be an empty function.
 */
function toSource(
  data,
  tabDepth,
  brackets,
  tabChar,
  quoteChar,
  functionFormatter
) {
  switch (typeof data) {
    case 'function':
      return functionFormatter(tabDepth, data)
    case 'number':
    case 'undefined':
    case 'boolean':
      return '' + data
    case 'string':
      return quoteChar + escape(data, quoteChar) + quoteChar
    case 'object':
      if (Array.isArray(data)) {
        return arrayToSource.apply(null, arguments)
      } else if (data === null) {
        // null is an object lol.
        return 'null'
      } else if (data instanceof Date) {
        return 'new Date(' + data.getTime() + ')'
      } else if (data instanceof RegExp) {
        return data.toString()
      } else {
        return objectToSource.apply(null, arguments)
      }
  }
}

// Wrap the toSource function to add in defaults.
module.exports = function(data, options) {
  options = options || {}
  var defaulted = [
    ['tabDepth', 0],
    ['enclose', true],
    ['tabChar', '\t'],
    ['quoteChar', "'"],
    ['functionFormatter', module.exports.defaultFnFormatter]
  ].map(function(tuple) {
    return options[tuple[0]] === undefined ? tuple[1] : options[tuple[0]]
  })
  if (
    options.quoteChar &&
    options.quoteChar !== "'" &&
    options.quoteChar !== '"'
  ) {
    throw new Error('Unsupported quote character ' + options.quoteChar)
  }
  return toSource.apply(null, [data].concat(defaulted))
}

module.exports.defaultFnFormatter = defaultFnFormatter
module.exports.mkFnFormatter = mkFnFormatter
module.exports.simpleFnFormatter = simpleFnFormatter
