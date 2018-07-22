const {expect} = require('chai');
const rewire = require('rewire');

const {Polynomial, ComplexNumber} = require('../calculator');

const complexNumber = rewire('../complexNumber');

let q;
let p;
let w;
let x;


let c1;
let c2;
let c3;
let f;
let g;
let h;

describe('ComplexNumber', () => {
	let u;
	let z;
	const PolarNumber = complexNumber.__get__('PolarNumber');
	const testReal = -8.5;
	const testImaginary = 2.1;
	before(() => {
		u = new ComplexNumber(testReal, testImaginary);
		z = new ComplexNumber(0, 2);
	});

	it('should have a constructor that takes two Numbers as arguments', () => {
		expect(new ComplexNumber(-3.2, 18.6)).to.be.an.instanceof(ComplexNumber);
	});

	it('should set the first argument to the real part and the second to the imaginary', () => {
		expect(u.real).to.equal(testReal);
		expect(u.imaginary).to.equal(testImaginary);
	});

	it('should implement a textVersion method that writes every complex number uniquely as a string', () => {
		expect(new ComplexNumber(0, 0).textVersion()).to.equal('0');
		expect(z.textVersion()).to.equal('2i');
		expect(u.textVersion()).to.equal(`${testReal} + ${testImaginary}i`);
	});

	it('should implement a polar method that returns a PolarNumber', function () {
		expect(z.polar()).to.deep.equal(new PolarNumber(2, 0.5));
		expect(z.polar().textVersion()).to.equal('2e^(0.5' + decodeURI(encodeURI('\u03C0')) + 'i)');
	});

	it('should implement a pow method that raises a complex number to an exponent', () => {
		expect(z.pow(0.5).textVersion()).to.equal('1 + i');
	});

	it('should implement a times method that correctly performs complex multiplication between complex numbers', () => {
		expect(z.times(new ComplexNumber(0, -1)).textVersion()).to.equal('2');
	});

	it('should implement a times method that correctly performs complex when the second argument is an array of two numbers', () => {
		expect(z.times([0, -1]).textVersion()).to.equal('2');
	});
});

describe('Polynomial', function () {
	before(function () {
		q = new Polynomial([18,-15,3]);
		p = new Polynomial([-1, 1]);
		w = new ComplexNumber(1, 2);
		x = new ComplexNumber(-3, 5);


		c1 = new ComplexNumber(71, 33);
		c2 = new ComplexNumber(2, 55);
		c3 = new ComplexNumber(61, 15);
		f = new Polynomial([1, w, 2]);
		g = new Polynomial([72, 51, 88, 2]);
		h = new Polynomial([c1, c2, c3]);
	})

	it('should implement an evaluate method that returns the ComplexNumber value of the polynomial for a given ComplexNumber input', () => {
		expect(new Polynomial([]).evaluate).to.be.an.instanceof(Function);
	});

	it('should evaluate each polynomial to the correct number', () => {
		expect(q.evaluate(new ComplexNumber(1, 0)).textVersion()).to.equal('6');
		expect(q.evaluate(new ComplexNumber(0, 1)).textVersion()).to.equal('15 + -15i');
		expect(q.evaluate(1).textVersion()).to.equal('6');
	});

	it('should implement a factor method that correctly factors quadratics', function () {
		expect(q.textVersion()).to.equal('18 + -15x + 3x^2');
		expect(q.factor().textVersion()).to.equal('3(x - 2)(x - 3)');
		expect(q.factor().expand().textVersion()).to.equal('18 + -15x + 3x^2');
		expect(f.factor().expand().textVersion()).to.equal(f.textVersion());
		expect(f.factor().expand().evaluate(3).textVersion()).to.equal(f.evaluate(3).textVersion());
		expect(f.factor().expand().evaluate(x).textVersion()).to.equal(f.evaluate(x).textVersion());
	});

	it('should implement a factor method that correctly factors cubics', function () {
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

	it('should have a divide method that divides Polynomials by other Polynomials', function () {
		expect(q.divide(new Polynomial([3])).textVersion()).to.equal('6 + -5x + x^2');
		expect(q.times(p).divide(p).textVersion()).to.equal(q.textVersion());
	});

	it('should have a divide method that divides Polynomials by arrays', function () {
		expect(q.divide([3]).textVersion()).to.equal('6 + -5x + x^2');
		expect(q.times(p).divide([3]).textVersion()).to.equal('-6 + 11x + -6x^2 + x^3');
	});
});