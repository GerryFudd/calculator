const ComplexNumber = require('./complexNumber');

class Polynomial {
	constructor(list) {
		this.coefficients = list.map((elem) => {
			if (typeof(elem) === 'number') {
				return new ComplexNumber(elem, 0);
			}
			
			if (Array.isArray(elem)){
				return new ComplexNumber(elem[0], elem[1]);
			}

			if (elem instanceof ComplexNumber) {
				return elem;
			}

			throw new Error('Polynomial terms must be a Number, an Array, or a ComplexNumber');
		});
	
		this.degree = this.coefficients
			.reduce((acc, coefficient, index) => {
				return coefficient.textVersion() === new ComplexNumber(0, 0).textVersion() ?
					acc	:
					index;
			}, -1);

		this.coefficients = this.coefficients.slice(0, this.degree + 1);
	}

	textVersion() {
		return this.coefficients.reduce((prev, current, index) => {
			let res;
			let coef;

			if (current.textVersion() === '1' && index !== 0) {
				coef = '';
			} else if (current.imaginary === 0 || current.real === 0) {
				coef = current.textVersion();
			} else {
				coef = '(' + current.textVersion() + ')';
			}

			if (current.textVersion() === '0') {
				res = prev;
			} else {
				if (index === 0) {
					res = prev + coef;
				} else if (index === 1) {
					res = prev + coef + 'x';
				} else {
					res = prev + coef + 'x^' + index;
				}

				if (index < this.degree) {
					res += ' + ';
				}
			}

			return res;
		}, '');
	}

	push(coefficient) {
		this.coefficients.push(coefficient);
		this.degree = this.coefficients.length - 1;
	}

	display() {
		console.log(this.textVersion());
		return this;
	}

	plus(arr) {
		let summand = arr;
		if (!(arr instanceof Polynomial)) {
			summand = new Polynomial(summand);
		}
		const result = [];

		const add = (short, long) => {
			long.forEach((elem, index) => {
				if (short[index]) {
					result[index] = elem.plus(short[index]);
				} else {
					result[index] = elem;
				}
			});
		}
		if (this.degree >= summand.degree) {
			add (summand.coefficients, this.coefficients);
		} else {
			add (this.coefficients, summand.coefficients);
		}

		return new Polynomial(result);
	}

	times(array) {
		let arr;
		if (array instanceof Polynomial) {
			arr = array;
		} else {
			arr = new Polynomial(array);
		}
		const result = [];

		this.coefficients.forEach((elem, ind) => {
			arr.coefficients.forEach((element, index) => {
				if (result[ind + index]) {
					result[ind + index] = result[ind + index].plus(elem.times(element));
				} else {
					result[ind + index] = elem.times(element);
				}
			});
		});

		return new Polynomial(result);
	};

	division(divisorArg) {
		let divisor = divisorArg;
		if (!(divisor instanceof Polynomial)) {
			// convert array to a polynomial
			divisor = new Polynomial(divisorArg);
		}
		// quotient is an empty polynomial to begin
		let quotient = new Polynomial([]);
		// the remainder is the numberator to begin
		let remainder = this;
		let quotDeg;
		let coef;
		let n;
		if (this.degree >= divisor.degree) {
			// quotDeg is the smallest nonzero term
			quotDeg = this.degree - divisor.degree;
			for (n = 0; n < quotDeg + 1; n++) {
				// place 0 in every place up to degree
				quotient.push(new ComplexNumber(0, 0));
			}
		}

		// repeat the process until the remainder is smaller than the divisor
		n = 0;
		while (remainder.degree >= divisor.degree) {
			// quotDeg is the smallest nonzero term
			quotDeg = remainder.degree - divisor.degree;
			// coef is the leading coefficient of the remainder divided by the leading coefficient of the denominator
			coef = remainder.coefficients[remainder.degree].times(divisor.coefficients[divisor.degree].pow(-1));
			// place the new term and make quotient into a polynomial
			quotient.coefficients[quotDeg] = coef;
			quotient = new Polynomial(quotient.coefficients);
			// remainder = numerator - quotient * divisor
			remainder = this.plus(quotient.times(divisor).times([[-1, 0]]));
			// clean up the remainder if its leading term wasn't removed
			remainder = new Polynomial(remainder.coefficients.slice(0,this.coefficients.length - n + 1));
			n++;
		}

		return {quotient, remainder};
	};

	divide(arr) {
		return this.division(arr).quotient;
	}

	remainder(arr) {
		return this.division(arr).remainder;
	}

	evaluate(number) {
		let numb;
		if (typeof(number) === 'number') {
			numb = new ComplexNumber(number, 0);
		} else {
			numb = number;
		}
		const result = this.coefficients.reduce(function (prev, current, ind) {
			return prev.plus(current.times(numb.pow(ind)));
		});
		return result;
	}

	factor() {
		const factors = [];
		let newFactor;
		let remainder;

		// The first value of factors is the coefficient of the whole
		if (this.degree !== -1) {
			factors.push(this.coefficients[this.degree]);
		}

		// Polynomials of degree 0 have no factors
		if (this.degree <= 0) {
			console.log('there are no factors');
			return this;
		}
		
		if (this.degree === 1) {
			// A polynomial of the form a + bx has a factor of the form -a / b
			newFactor = this.coefficients[0].times(this.coefficients[1].pow(-1)).times([-1, 0]);
			factors.push(newFactor);
			return new Factored(factors);
		}
		
		if (this.degree === 2) {
			newFactor = quadraticEquation(this.coefficients[2], this.coefficients[1], this.coefficients[0]);

			// remainder is (c + bx + ax^2)/(x - z)
			remainder = this.divide([newFactor.times([-1, 0]), 1]);

			// thing is an array containing the factors of the remainder
			const thing = remainder.factor();
			thing.factors.push(newFactor);
			return thing;
		}
		
		if (this.degree === 3) {
			newFactor = cubicEquation(this);
			// remainder is (ax^3 + bx^2 + cx + d)/(x - newFactor)
			remainder = this.divide([newFactor.times([-1, 0]), 1]);

			// thing is an array containing the factors of the remainder
			const thing = remainder.factor();
			thing.factors.push(newFactor);
			return thing;
		}

		return this;
	};

	expand() {
		return this;
	};
}

function quadraticEquation (a, b, c) {

	// A quadratic c + bx + ax^2 will have two roots
	// The value A is -b / (2a)
	const A = b.times(a.times([-2,0]).pow(-1));
	// The value C is -c / a
	const C = c.times(a.pow(-1)).times([-1, 0]);
	// The new factor is z = A + sqrt(A^2 + C)
	return A.plus(A.pow(2).plus(C).pow(0.5));
}

function cubicEquation (poly) {
	// Divide everything by the leading coefficient x^3+Ax^2+Bx+C=(ax^3+bx^2+cx+d)/a
	const reducedPoly = poly.divide([poly.coefficients[3]]);
	const A = reducedPoly.coefficients[2];
	const B = reducedPoly.coefficients[1];
	const C = reducedPoly.coefficients[0];
	// Set thing = 1 / -3.  This value comes up repeatedly.
	const thing = new ComplexNumber(-3, 0).pow(-1);
	// set x = t - A/3
	const x = new Polynomial([A.times(thing),1]);
	// write a new polynomial by replacing x with t - A/3.  This new polynomial has no t^2 term.
	// T=t^3+Mx+N
	const T = x.times(x.times(x)).plus(x.times(x).times([A])).plus(x.times([B])).plus([C]);
	const one = T.coefficients[3];
	const M = T.coefficients[1];
	const N = T.coefficients[0];
	// Suppose that there are complex numbers u and v.
	// Then (u + v)^3 = u^3 + 3u^2v + 3uv^2 + v^3
	//			(u + v)^3 = (3uv)(u + v) + u^3 + v^3
	//			(u + v)^3 + (-3uv)(u + v) + (-u^3 + -v^3) = 0
	// If there exist numbers u and v such that M = -3uv and N = -u^3 + -v^3, then t = u + v will satisfy
	// t^3 + Mt + N = 0.
	// I will solve for u.  First note that v = -M / (3u) and therefore N = -u^3 + M^3 / (3u)^3.
	// This leads to (u^3)^2 + Nu^3 - (M / 3)^3 = 0.  Therefore, u^3 is a solution to x^2 + Nx - (M / 3)^3 = 0.
	const uCubed = quadraticEquation(one, N, M.times(thing).pow(3));
	// Since M = -3uv, we know that v = M / (-3u)
	function getV (number) {
		return M.times(number.times([-3, 0]).pow(-1));
	}
	// Since t = u + v, this means that x = u + v - A / 3
	// There are three values of u for a given uCubed.
	let solution = new ComplexNumber(0, 0);
	let n = -1;
	let u;
	let v;
	while (poly.evaluate(solution).textVersion() !== '0' && n < 2) {
		n++;
		u = uCubed.pow(1/3).times(new ComplexNumber(-1, 0).pow(n * 2 / 3));
		v = getV(u);
		solution = u.plus(v).plus(A.times(thing));
	}

	return solution;
}

class Factored {
	constructor(list) {
		this.factors = list;
	}

	textVersion() {
		let str = '';
		this.factors.forEach((elem, index) => {
			if (index === 0) {
				if (elem.textVersion() !== '1') {
					if(elem.real === 0 || elem.imaginary === 0) {
						str += elem.textVersion();
					} else {
						str += '(' + elem.textVersion() + ')';
					}
				}
			} else {
				if (elem.textVersion() === '0') {
					str += 'x';
				} else if (elem.real > 0 && elem.imaginary === 0) {
					str += '(x - ' + (elem.textVersion()) + ')';
				} else {
					str += '(x + ' + (elem.times([-1, 0]).textVersion()) + ')';
				}
			}
		});
		return str;
	};

	display() {
		console.log(this.textVersion());
		return this;
	};

	expand() {
		return this.factors.reduce( function (prev, current, index) {
			if (index === 0) {
				return new Polynomial([current]);
			} else {
				return prev.times([current.times([-1, 0]), [1, 0]]);
			}
		}, new Polynomial([]));
	};
}

module.exports = Polynomial;