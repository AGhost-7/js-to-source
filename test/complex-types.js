var expect = require('chai').expect;
var toSource = require('../index');

describe('complex types (arrays and objects)', function() {
	'use strict';

	it('will output simple structures with functioning defaults', function() {
		var simple = {
			a: 2,
			b: [1, 2, 3]
		};
		var output = toSource(simple);
		expect(output).to.contain('a');
		expect(output).to.contain('[');
		expect(output).to.contain('b');
	});

	it('outputs nested objects', function() {
		var nested = {
			a: {
				b: {
					c: {
						d: 2
					}
				}
			}
		};
		var output = toSource(nested);
		expect(output).to.contain('c: {');
		expect(output).to.contain('d: 2');
	});

	it('outputs arrays containing objects', function() {
		var objarr = [
			{ a: 1 },
			{ b: 2 },
			{
				c: {
					d: 3
				}
			}
		];
		var output = toSource(objarr);
		expect(output).to.contain('a: 1');
		expect(output).to.contain('},\n');
		expect(output).to.contain('d');
	});

	it('should be possible to output without the closing brackets', function() {
		var obj = {
			a: 1,
			b: {
				c: 2
			}
		};
		var output = toSource(obj, { tabDepth: -1, enclose: false });
		expect(output).to.not.contain('{\n\ta');
		expect(output).to.contain('\tc');
	});
});
