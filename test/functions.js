/* jshint expr: true */

var expect = require('chai').expect;
var toSource = require('../index');
var fnToStr = require('../lib/fn-to-str');

describe('function support', function() {
	// mock function
	var identity = function(a) {
		return a;
	};
	
	// defaults!
	var formatter = toSource.mkFnFormatter();
	
	it('should return an empty function by default', function() {
		expect(toSource(identity)).to.equal('function() {}');
	});

	it('should use the functionFormatter if specified', function() {
		var formatter = function() { return 'foobar'; };
		var options = {
			functionFormatter: function() {
				return 'foobar';
			}
		};
		expect(toSource(identity, options)).to.equal('foobar');

		var complex = {
			a: {
				b: identity
			}
		};

		expect(toSource(complex, options)).to.contain('foobar');
	});

	it('has a formatter which indents properly', function() {
		var formatted = formatter(1, identity);
		var lines = formatted.split('\n');

		expect(formatted).to.contain('return');
		expect(lines[1]).to.contain('\t\t');
		expect(lines[0]).to.not.contain('\t');
	});
	
	it('should format inside an object properly', function() {
		var obj = {
			foo: {
				bar: function() {
					return 'foobar!';
				}
			}
		};

		var sourced = toSource(obj, { 
			functionFormatter: formatter
		});

		expect(sourced.split('\n')[4]).to.match(/^\t{2}[}]/);
	});

	it('should be able to detect which functions are native', function() {
		var isNative = fnToStr.isNativeFn;
		expect(isNative(Date.now)).to.be.true;
		expect(isNative(function() {})).to.be.false;
		expect(isNative(Math.log)).to.be.true;
	});

	it('should be able to output native functions', function() {
		expect(fnToStr(Math.log)).to.be.equal('Math.log');
		expect(fnToStr(Object.defineProperty)).to.be.equal('Object.defineProperty');

		var sourced = toSource(Object.keys, {
			functionFormatter: formatter
		});
		expect(sourced).to.contain('Object.keys');
	});
});
