
/* jshint node: true */

'use strict';

function tabs(ln) {
	var str = '';
	for(var i = 0; i < ln; i++) str += '\t';
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
 */
function toSource(data, tabDepth, quoteDepth, brackets) {
	// By default, brackets should be added at both ends of the object or array.
	if(brackets === undefined) brackets = true;

	switch(typeof data) {
		case 'boolean': return '' + data;
		case 'string': return '\'' + data + '\'';
		case 'object':
			var inner;
			if(Array.isArray(data)) {
				inner = data.map(function(part) {
					return tabs(tabDepth + 1) + toSource(part, tabDepth + 1, quoteDepth - 1);
				}).join(',\n');
				
				if(brackets) {
					return '[\n' +
						inner + '\n' +
						tabs(tabDepth) + ']';
				} else {
					return inner;
				}

			} else {
				var str = '{\n';
				var objListing = Object.keys(data).map(function(key) {
					var 
						sourced = toSource(data[key], tabDepth + 1, quoteDepth - 1),
						literalKey = quoteDepth > 0 ? '\'' + key + '\'' : key,
						base = tabs(tabDepth + 1) + literalKey + ': ';
					return base + sourced;
				});

				inner = objListing.join(',\n');
				if(brackets) {
					return '{\n' + 
						inner + '\n' + 
						tabs(tabDepth) + '}';
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
