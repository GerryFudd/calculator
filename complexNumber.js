const TOL = 10;

/**
 * Returns an integer if numeric is within 10^-TOL of that integer.  Otherwise it returns numeric.
 * @param {Number} numeric 
 */
function checkIfInt (numeric) {
	let i = numeric;
	const j = -i;
	const test = Math.floor(i);
	const jest = Math.floor(j);
	if (i.toFixed(TOL) === test.toFixed(TOL)) {
		// console.log('rounding ' + i + ' to ' + test + '.');
		i = 0 + test;
	} else if (j.toFixed(TOL) === jest.toFixed(TOL)) {
		// console.log('rounding ' + i + ' to ' + (-jest) + '.');
		i = 0 - jest;
	}
	return i;
}

/**
 * Class that represents a complex number as a pair of polar coordinates in the complex plane.
 */
class PolarNumber {
	/**
	 * Constructor that takes a, which represents the norm of a complex number, and b, which represents
	 * the number of half fotations from the positive real axis. It sets this.r = a and this.th to a
	 * number of half rotations between 1 and -1 that is equivalent to b.
	 * @param {Number} a 
	 * @param {Number} b 
	 * @constructor
	 */
	constructor(a, b) {
		this.r = a;
		if (b > 1 || b < -1) {
			const c = (b + 1) / 2;
			this.th = (c - Math.floor(c)) * 2 - 1;
		} else {
			this.th = b;
		}
	}

	/**
	 * Creates a text representation of the polar number as re^(i*pi*b)
	 * @returns {text}
	 */
	textVersion() {
		return this.r + 'e^(' + this.th + decodeURI(encodeURI('\u03C0')) + 'i)'
	}

	display() {
		console.log(this.textVersion());
		return this;
	};

	rectangular() {
		const r = this.r * Math.cos(Math.PI * this.th);
		const i = this.r * Math.sin(Math.PI * this.th);
		return new ComplexNumber(r, i);
	}

	times(arr) {
		let multiplicand = arr;
		if (!(arr instanceof PolarNumber)) {
			multiplicand = new PolarNumber(...arr);
		}
		const r = this.r * multiplicand.r;
		const th = this.th + multiplicand.th;
		return new PolarNumber(r, th);
	}

	pow(num) {
		const r = Math.pow(this.r, num);
		const th = this.th * num;
		return new PolarNumber(r, th);
	}
}

/**
 * A representation of a complex number as a real part and an imaginary part.
 */
class ComplexNumber {
	/**
	 * This constructor sets the real and imaginary parts of a complex number, but sets those
	 * values as integers if they are close enough to that integer.
	 * @param {Number} real 
	 * @param {Number} imaginary 
	 */
	constructor(real, imaginary) {
		if (Math.floor(real) !== real) {
			this.real = checkIfInt(real);
		} else {
			this.real = real;
		}
		if (Math.floor(imaginary) !== imaginary) {
			this.imaginary = checkIfInt(imaginary);
		} else {
			this.imaginary = imaginary
		}
	}

	/**
	 * Returns a string representation of the complex number as 'real + (imaginary)i'
	 * @returns {String} textVersion
	 */
	textVersion() {
		const {real, imaginary} = this;
		let str = '';
		let imaginaryPart = `${imaginary}`;
		if (imaginary === 1) {
			imaginaryPart = '';
		}
		if (imaginary === 0) {
			str += real;
		} else if (real === 0) {
			str += imaginaryPart + 'i';
		} else {
			str += real + ' + ' + imaginaryPart + 'i';
		}
		return str;
	}

	display() {
		console.log(this.textVersion());
		return this;
	}

	plus(arr) {
		let summand = arr;
		if (!(arr instanceof ComplexNumber)) {
			summand = new ComplexNumber(...summand);
		}
		const r = this.real + summand.real;
		const i = this.imaginary + summand.imaginary;
		return new ComplexNumber(r, i);
	}

	conjugate() {
		const r = this[0];
		const i = -this[1];
		return new ComplexNumber(this.real, -1 * this.imaginary);
	}

	times(arr) {
		let multiplicand = arr;
		if (!(arr instanceof ComplexNumber)) {
			multiplicand = new ComplexNumber(...multiplicand);
		}
		const r = this.real * multiplicand.real - this.imaginary * multiplicand.imaginary;
		const i = this.real * multiplicand.imaginary + this.imaginary * multiplicand.real;
		return new ComplexNumber(r, i);
	}

	mod() {
		return Math.sqrt(this.times(this.conjugate()).real);
	};

	polar() {
		const r = this.mod();
		if (r === 0) {
			return new PolarNumber(r, 0);
		} else {
			let th;
			if (this.imaginary >= 0) {
				th = Math.acos(this.real / r) / Math.PI;
			} else {
				th = - Math.acos(this.real / r) / Math.PI;
			}
			return new PolarNumber(r, th);
		}
	};

	pow(num) {
		return this.polar().pow(num).rectangular();
	};
}

module.exports = ComplexNumber;