var Polynomial = require('../polynomial.js');
var ComplexNumber = require('../complexNumber.js')

var q = Polynomial([18,-15,3]);
var p = Polynomial([-1, 1]);
var z = ComplexNumber(0, 2);

describe('calculator', function () {
	it('should have a Polynomial constructor that creates an object with several methods', function (done) {
		expect(q.textVersion()).toEqual('18 + -15x + 3x^2');
		expect(q.factor().textVersion()).toEqual('3(x - 2)(x - 3)');
		expect(q.factor().expand().textVersion()).toEqual('18 + -15x + 3x^2');
		expect(q.times(p).factor().textVersion()).toEqual('3(x - 1)(x - 2)(x - 3)');
		done();
	});

	it('should have a ComplexNumber constructor that creates an object with several methods', function (done) {
		expect(z.textVersion()).toEqual('2i');
		expect(z.polar().textVersion()).toEqual('2e^(0.5' + decodeURI(encodeURI('\u03C0')) +'i)');
		expect(z.pow(0.5).textVersion()).toEqual('1 + i');
		expect(z.times([0, -1]).textVersion()).toEqual('2');
		done();
	})
});