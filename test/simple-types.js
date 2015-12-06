var expect = require('chai').expect;
var toSource = require('../index');

describe('simple types', function() {
	it('parses strings', function() {
		var str = 'hello world';
		expect(toSource(str, { quoteChar: '"' })).to.equal('"hello world"');
		expect(toSource(str)).to.equal('\'hello world\'');
	});

	it('parses numbers', function() {
		var n = 1;
		expect(toSource(n)).to.equal('1');
	});

	it('parses undefined', function() {
		expect(toSource(undefined)).to.equal('undefined');
		var complex = {
			a: undefined
		};
		expect(toSource(complex)).to.equal('{\n\ta: undefined\n}');
	});

	it('parses booleans', function() {
		expect(toSource(true)).to.equal('true');
		var complex = {
			a: true
		};
		expect(toSource(complex)).to.equal('{\n\ta: true\n}');
	});

	it('parses dates', function() {
		var d = new Date();
		var sourced = toSource(d);
		 
		expect(eval(sourced).getTime()).to.equal(d.getTime());
	});

	it('parses regular expressions', function() {
		var reg = /foobar/;
		expect(toSource(reg)).to.equal('/foobar/');
	});

});
