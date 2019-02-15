/**
 * Escapes a javascript string or identifier so that it can be quoted properly.
 */

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

module.exports = escape
