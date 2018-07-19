var {expect} = require('chai');
var {Polynomial, ComplexNumber} = require('../calculator');

var q;
var p;
var z;
var w;
var x;


var c1;
var c2;
var c3;
var f;
var g;
var h;

describe('calculator', function () {
	before(function () {
		q = Polynomial([18,-15,3]);
		// p = Polynomial([-1, 1]);
		// z = ComplexNumber(0, 2);
		// w = ComplexNumber(1, 2);
		// x = ComplexNumber(-3, 5);


		// c1 = ComplexNumber(71, 33);
		// c2 = ComplexNumber(2, 55);
		// c3 = ComplexNumber(61, 15);
		// f = Polynomial([1, w, 2]);
		// g = Polynomial([72, 51, 88, 2]);
		// h = Polynomial([c1, c2, c3]);
	})
	it('should have a Polynomial constructor that factors quadratics', function () {
		expect(q.textVersion()).toEqual('18 + -15x + 3x^2');
		expect(q.factor().textVersion()).toEqual('3(x - 2)(x - 3)');
		expect(q.factor().expand().textVersion()).toEqual('18 + -15x + 3x^2');
		expect(f.factor().expand().textVersion()).toEqual(f.textVersion());
		expect(f.factor().expand().evaluate(3).textVersion()).toEqual(f.evaluate(3).textVersion());
		expect(f.factor().expand().evaluate(x).textVersion()).toEqual(f.evaluate(x).textVersion());
	});

	it('should have a Polynomial constructor that divides polynomials', function () {
		expect(q.divide([3]).textVersion()).toEqual('6 + -5x + x^2');
		expect(q.times(p).divide([3]).textVersion()).toEqual('-6 + 11x + -6x^2 + x^3');
	});

	it('should have a Polynomial constructor that factors cubics', function () {
		expect(q.times(p).factor().textVersion()).toEqual('3(x - 1)(x - 2)(x - 3)');
		q.times(p).factor().slice(1,4).forEach(function (elem) {
			expect(q.times(p).evaluate(elem).textVersion()).toEqual('0');
		})
		g.factor().slice(1,4).forEach(function (elem) {
			expect(g.evaluate(elem).textVersion()).toEqual('0');
		})
		h.factor().slice(1,4).forEach(function (elem) {
			expect(h.evaluate(elem).textVersion()).toEqual('0');
		})
		expect(g.factor().expand().textVersion()).toEqual(g.textVersion());
		expect(h.factor().expand().textVersion()).toEqual(h.textVersion());
	});

	it('should have a ComplexNumber constructor that creates an object with several methods', function () {
		expect(ComplexNumber(0, 0).textVersion()).toEqual('0');
		expect(z.textVersion()).toEqual('2i');
		expect(z.polar().textVersion()).toEqual('2e^(0.5' + decodeURI(encodeURI('\u03C0')) + 'i)');
		expect(z.pow(0.5).textVersion()).toEqual('1 + i');
		expect(z.times([0, -1]).textVersion()).toEqual('2');
	})
});