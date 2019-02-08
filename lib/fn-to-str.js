var nativeFnNames = [
  // String
  'String.fromCharCode',
  'String.fromCodePoint',
  'String.prototype.anchor',
  'String.prototype.charAt',
  'String.prototype.charCodeAt',
  'String.prototype.codePointAt',
  'String.prototype.concat',
  'String.prototype.endsWith',
  'String.prototype.includes',
  'String.prototype.indexOf',
  'String.prototype.lastIndexOf',
  'String.prototype.link',
  'String.prototype.localeCompare',
  'String.prototype.match',
  'String.prototype.normalize',
  'String.prototype.repeat',
  'String.prototype.replace',
  'String.prototype.search',
  'String.prototype.slice',
  'String.prototype.split',
  'String.prototype.startsWith',
  'String.prototype.substr',
  'String.prototype.substring',
  'String.prototype.toLocaleLowerCase',
  'String.prototype.toLocaleUpperCase',
  'String.prototype.toLowerCase',
  'String.prototype.toString',
  'String.prototype.toUpperCase',
  'String.prototype.trim',
  'String.prototype.trimLeft',
  'String.prototype.trimRight',
  'String.prototype.valueOf',
  'String.raw',

  // Regexp
  'RegExp.prototype.exec',
  'RegExp.prototype.test',
  'RegExp.prototype.toSource',
  'RegExp.prototype.toString',

  // Date
  'Date.now',
  'Date.UTC',
  'Date.parse',
  'Date.prototype.getDate',
  'Date.prototype.getDay',
  'Date.prototype.getFullYear',
  'Date.prototype.getHours',
  'Date.prototype.getMilliseconds',
  'Date.prototype.getMinutes',
  'Date.prototype.getMonth',
  'Date.prototype.getSeconds',
  'Date.prototype.getTime',
  'Date.prototype.getTimezoneOffset',
  'Date.prototype.getUTCDate',
  'Date.prototype.getUTCDay',
  'Date.prototype.getUTCFullYear',
  'Date.prototype.getUTCHours',
  'Date.prototype.getUTCMilliseconds',
  'Date.prototype.getUTCMinutes',
  'Date.prototype.getUTCMonth',
  'Date.prototype.getUTCSeconds',
  'Date.prototype.getYear',
  'Date.prototype.setDate',
  'Date.prototype.setFullYear',
  'Date.prototype.setHours',
  'Date.prototype.setMilliseconds',
  'Date.prototype.setMinutes',
  'Date.prototype.setMonth',
  'Date.prototype.setSeconds',
  'Date.prototype.setTime',
  'Date.prototype.setUTCDate',
  'Date.prototype.setUTCFullYear',
  'Date.prototype.setUTCHours',
  'Date.prototype.setUTCMilliseconds',
  'Date.prototype.setUTCMinutes',
  'Date.prototype.setUTCMonth',
  'Date.prototype.setUTCSeconds',
  'Date.prototype.setYear',
  'Date.prototype.toDateString',
  'Date.prototype.toGMTString',
  'Date.prototype.toISOString',
  'Date.prototype.toJSON',
  'Date.prototype.toLocaleDateString',
  'Date.prototype.toLocaleFormat',
  'Date.prototype.toLocaleString',
  'Date.prototype.toLocaleTimeString',
  'Date.prototype.toSource',
  'Date.prototype.toString',
  'Date.prototype.toTimeString',
  'Date.prototype.toUTCString',
  'Date.prototype.valueOf',
  // Object
  'Object.assign',
  'Object.create',
  'Object.defineProperties',
  'Object.defineProperty',
  'Object.freeze',
  'Object.getOwnPropertyDescriptor',
  'Object.getOwnPropertyNames',
  'Object.getOwnPropertySymbols',
  'Object.getPrototypeOf',
  'Object.is',
  'Object.isExtensible',
  'Object.isFrozen',
  'Object.isSealed',
  'Object.keys',
  'Object.preventExtensions',
  'Object.prototype.hasOwnProperty',
  'Object.prototype.isPrototypeOf',
  'Object.prototype.propertyIsEnumerable',
  'Object.prototype.toLocaleString',
  'Object.prototype.toSource',
  'Object.prototype.toString',
  'Object.prototype.unwatch',
  'Object.prototype.valueOf',
  'Object.prototype.watch',
  'Object.seal',
  'Object.setPrototypeOf',

  // Array
  'Array.from',
  'Array.isArray',
  'Array.of',
  'Array.prototype.concat',
  'Array.prototype.copyWithin',
  'Array.prototype.entries',
  'Array.prototype.every',
  'Array.prototype.fill',
  'Array.prototype.filter',
  'Array.prototype.find',
  'Array.prototype.findIndex',
  'Array.prototype.forEach',
  'Array.prototype.includes',
  'Array.prototype.indexOf',
  'Array.prototype.join',
  'Array.prototype.keys',
  'Array.prototype.lastIndexOf',
  'Array.prototype.map',
  'Array.prototype.pop',
  'Array.prototype.push',
  'Array.prototype.reduce',
  'Array.prototype.reduceRight',
  'Array.prototype.reverse',
  'Array.prototype.shift',
  'Array.prototype.slice',
  'Array.prototype.some',
  'Array.prototype.sort',
  'Array.prototype.splice',
  'Array.prototype.toLocaleString',
  'Array.prototype.toSource',
  'Array.prototype.toString',
  'Array.prototype.unshift',
  'Array.prototype.values',

  // Function
  'Function.prototype.apply',
  'Function.prototype.bind',
  'Function.prototype.call',
  'Function.prototype.isGenerator',
  'Function.prototype.toSource',
  'Function.prototype.toString',

  // JSON
  'JSON.parse',
  'JSON.stringify',

  // Number
  'Number.isNaN',
  'Number.isFinite',
  'Number.isInteger',
  'Number.isSafeInteger',
  'Number.parseFloat',
  'Number.parseInt',

  // Math
  'Math.abs',
  'Math.acos',
  'Math.acosh',
  'Math.asin',
  'Math.asinh',
  'Math.atan',
  'Math.atan2',
  'Math.atanh',
  'Math.cbrt',
  'Math.ceil',
  'Math.clz32',
  'Math.cos',
  'Math.cosh',
  'Math.exp',
  'Math.expm1',
  'Math.floor',
  'Math.fround',
  'Math.hypot',
  'Math.imul',
  'Math.log',
  'Math.log10',
  'Math.log1p',
  'Math.log2',
  'Math.max',
  'Math.min',
  'Math.pow',
  'Math.random',
  'Math.round',
  'Math.sign',
  'Math.sin',
  'Math.sinh',
  'Math.sqrt',
  'Math.tan',
  'Math.tanh',
  'Math.trunc',

  // Misc
  'isNaN',
  'isFinite',
  'eval',
  'parseFloat',
  'parseInt',
  'uneval'
]

var nativeFns = null
var globalScope = (function() {
  return this
})()

/**
 * Returns undefined if the value isn't present in the global scope.
 */
function findGlobalVal(name) {
  var parts = name.split('.')
  // console.log('parts', parts);
  return parts.reduce(function(target, part) {
    // console.log('target', target, 'part', part);
    if (target === undefined) return target
    return target[part]
  }, globalScope)
}

function createNativeFnList() {
  return nativeFnNames.map(function(name) {
    return {
      name: name,
      value: findGlobalVal(name)
    }
  })
}

function findNativeFnName(fn) {
  for (var i = 0; i < nativeFns.length; i++) {
    var item = nativeFns[i]
    if (item.value === fn) return item.name
  }
}

function fnToStr(fn) {
  var str = fn.toString()
  if (isNativeFn(fn)) {
    if (nativeFns === null) {
      // lazily initialize...
      nativeFns = createNativeFnList()
    }
    var converted = findNativeFnName(fn)
    // In some cases, the native function won't be a standard built-in.
    // For these situations, I think I'd rather have the user know what is
    // going on than silently fail.
    if (!converted) {
      throw new Error('Serialization for native function not supported.')
    }
    return converted
  }
  return str
}
function isNativeFn(fn) {
  return /function [A-z_]+\(\) { \[native code\] }/.test(fn)
}
module.exports = fnToStr
module.exports.isNativeFn = isNativeFn
