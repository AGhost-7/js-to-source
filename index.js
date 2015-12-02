
/* jshint node: true */

'use strict';

function tabs(ln, tabChar) {
	var str = '';
	for(var i = 0; i < ln; i++) str += tabChar;
	return str;
}

/**
 * Turns code back into source! Doesn't support functions or comments though.
 *
 * @param {string} data; This is the javascript value to convert back into source text.
 * @param {number} tabDepth; Is the indentation level that the value is starting at.
 * @param {number} quoteDepth; Specifies how far deep into the object you want the key to be single
 * quoted.
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
function toSource(data, tabDepth, quoteDepth, brackets, tabChar, functionFormatter) {
	// By default, brackets should be added at both ends of the object or array.
	if(brackets === undefined) brackets = true;

	if(!tabChar) tabChar = '\t';

	if(functionFormatter === undefined) {
		functionFormatter = function() {
			return 'function() {}';
		};
	}

	switch(typeof data) {
		case 'function': return functionFormatter(tabDepth, data);
		case 'boolean': return '' + data;
		case 'string': return '\'' + data + '\'';
		case 'object':
			var inner;
			if(Array.isArray(data)) {
				inner = data.map(function(part) {
					var src = toSource(part, tabDepth + 1, quoteDepth - 1, true, tabChar, functionFormatter);
					return tabs(tabDepth + 1) + src;
				}).join(',\n');
				
				if(brackets) {
					return '[\n' +
						inner + '\n' +
						tabs(tabDepth, tabChar) + ']';
				} else {
					return inner;
				}

			} else {
				var str = '{\n';
				var objListing = Object.keys(data).map(function(key) {
					var 
						sourced = toSource(data[key], tabDepth + 1, quoteDepth - 1, true, tabChar, functionFormatter),
						literalKey = quoteDepth > 0 ? '\'' + key + '\'' : key,
						base = tabs(tabDepth + 1, tabChar) + literalKey + ': ';
					return base + sourced;
				});

				inner = objListing.join(',\n');
				if(brackets) {
					return '{\n' + 
						inner + '\n' + 
						tabs(tabDepth, tabChar) + '}';
				} else {
					return inner;
				}
			}
			break;

		case 'number':
			return data;

	}
}

module.exports = toSource;
