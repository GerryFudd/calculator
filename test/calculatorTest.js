const {expect} = require('chai');
const {Polynomial, ComplexNumber} = require('../calculator');

let q;
let p;
let z;
let w;
let x;


let c1;
let c2;
let c3;
let f;
let g;
let h;

describe('calculator', function () {
	before(function () {
		q = new Polynomial([18,-15,3]);
		p = new Polynomial([-1, 1]);
		z = new ComplexNumber(0, 2);
		w = new ComplexNumber(1, 2);
		x = new ComplexNumber(-3, 5);


		c1 = new ComplexNumber(71, 33);
		c2 = new ComplexNumber(2, 55);
		c3 = new ComplexNumber(61, 15);
		f = new Polynomial([1, w, 2]);
		g = new Polynomial([72, 51, 88, 2]);
		h = new Polynomial([c1, c2, c3]);
	})
	it('should have a Polynomial constructor that factors quadratics', function () {
		expect(q.textVersion()).to.equal('18 + -15x + 3x^2');
		expect(q.factor().textVersion()).to.equal('3(x - 2)(x - 3)');
		expect(q.factor().expand().textVersion()).to.equal('18 + -15x + 3x^2');
		expect(f.factor().expand().textVersion()).to.equal(f.textVersion());
		expect(f.factor().expand().evaluate(3).textVersion()).to.equal(f.evaluate(3).textVersion());
		expect(f.factor().expand().evaluate(x).textVersion()).to.equal(f.evaluate(x).textVersion());
	});

	it('should have a Polynomial constructor that divides polynomials', function () {
		expect(q.divide([3]).textVersion()).to.equal('6 + -5x + x^2');
		expect(q.times(p).divide([3]).textVersion()).to.equal('-6 + 11x + -6x^2 + x^3');
	});

	it('should have a Polynomial constructor that factors cubics', function () {
		expect(q.times(p).factor().textVersion()).to.equal('3(x - 1)(x - 2)(x - 3)');
		q.times(p).factor().factors.slice(1,4).forEach(function (elem) {
			expect(q.times(p).evaluate(elem).textVersion()).to.equal('0');
		})
		g.factor().factors.slice(1,4).forEach(function (elem) {
			expect(g.evaluate(elem).textVersion()).to.equal('0');
		})
		h.factor().factors.slice(1,4).forEach(function (elem) {
			expect(h.evaluate(elem).textVersion()).to.equal('0');
		})
		expect(g.factor().expand().textVersion()).to.equal(g.textVersion());
		expect(h.factor().expand().textVersion()).to.equal(h.textVersion());
	});

	it('should have a ComplexNumber constructor that creates an object with several methods', function () {
		expect(new ComplexNumber(0, 0).textVersion()).to.equal('0');
		expect(z.textVersion()).to.equal('2i');
		expect(z.polar().textVersion()).to.equal('2e^(0.5' + decodeURI(encodeURI('\u03C0')) + 'i)');
		expect(z.pow(0.5).textVersion()).to.equal('1 + i');
		expect(z.times([0, -1]).textVersion()).to.equal('2');
	})
});