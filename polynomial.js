var ComplexNumber = require('./complexNumber.js');

function Polynomial (list) {
	var poly = list;

	poly = poly.map(function (elem, index) {
		if (typeof(elem) === 'number') {
			return ComplexNumber(elem, 0);
		} else {
			return elem;
		}
	});
	
	var last = poly[poly.length - 1];
	while (last === ComplexNumber(0, 0)) {
		poly.pop();
		last = poly[poly.length - 1];
	}	

	poly.degree = poly.length - 1;

	poly.textVersion = function () {
		var str = this.reduce(function (prev, current, index) {
			var res;
			var coef;

			if (current.textVersion() === '1' && index !== 0) {
				coef = '';
			} else if (current[1] === 0 || current[0] === 0) {
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

				if (index < poly.length - 1) {
					res += ' + ';
				}
			}

			return res;
		}, '');
		return str;
	};

	poly.display = function () {
		console.log(this.textVersion());
		return this;
	};

	poly.plus = function(arr) {
		var result = [];

		function add (short, long) {
			long.forEach(function (elem, index) {
				if (short[index]) {
					result[index] = elem.plus(short[index]);
				} else {
					result[index] = elem;
				}
			});
		}
		if (this.length >= arr.length) {
			add (arr, this);
		} else {
			add (this, arr);
		}

		return Polynomial(result);
	};

	poly.times = function(array) {
		var arr = Polynomial(array);
		var result = [];

		this.forEach( function (elem, ind) {
			arr.forEach( function (element, index) {
				if (result[ind + index]) {
					result[ind + index] = result[ind + index].plus(elem.times(element));
				} else {
					result[ind + index] = elem.times(element);
				}
			});
		});

		return Polynomial(result);
	};

	poly.division = function (array) {
		// convert array to a polynomial
		var arr = Polynomial(array);
		// quotient is an empty polynomial to begin
		var quotient = Polynomial([]);
		// the remainder is the numberator to begin
		var remainder = this;
		var quotDeg;
		var coef;
		var n;
		if (this.length >= arr.length) {
			// quotDeg is the smallest nonzero term
			quotDeg = this.length - arr.length;
			for (n = 0; n < quotDeg + 1; n++) {
				// place 0 in every place up to degree
				quotient.push(0);
			}
		}

		// repeat the process until the remainder is smaller than the divisor
		n = 0;
		while (remainder.length >= arr.length && n < this.length + 1) {
			// quotDeg is the smallest nonzero term
			quotDeg = remainder.length - arr.length;
			// coef is the leading coefficient of the remainder divided by the leading coefficient of the denominator
			coef = remainder[remainder.length - 1].times(arr[arr.length - 1].pow(-1));
			// place the new term and make quotient into a polynomial
			quotient[quotDeg] = coef;
			quotient = Polynomial(quotient);
			// remainder = numerator - quotient * divisor
			remainder = this.plus(quotient.times(arr).times([[-1, 0]]));
			// clean up the remainder if its leading term wasn't removed
			if (remainder.length === this.length - n) {
				remainder.pop();
				remainder = Polynomial(remainder);
			}
			n++;
		}

		return [Polynomial(quotient), remainder];
	};

	poly.divide = function (arr) {
		return this.division(arr)[0];
	};

	poly.remainder = function (arr) {
		return this.division(arr)[1];
	};

	poly.evaluate = function (number) {
		var numb;
		if (typeof(number) === 'number') {
			numb = ComplexNumber(number, 0);
		} else {
			numb = number;
		}
		var result = this.reduce(function (prev, current, ind) {
			return prev.plus(current.times(numb.pow(ind)));
		});
		return result.display();
	};

	poly.factor = function () {
		var factors = [];
		var newFactor;
		var remainder;

		// The first value of factors is the coefficient of the whole
		if (this.length !== 0) {
			factors.push(this[this.length - 1]);
		}

		// Polynomials of degree 0 have no factors
		if (this.length <= 1) {
			console.log('there are no factors');
			return this;
		} else if (this.length === 2) {
			// A polynomial of the form a + bx has a factor of the form -a / b
			newFactor = this[0].times(this[1].pow(-1)).times([-1, 0]);
			factors.push(newFactor);
			return Factored(factors);
		} else if (this.length === 3) {

			// A quadratic c + bx + ax^2 will have two roots
			// The value A is -b / (2a)
			var A = this[1].times(this[2].times([-2, 0]).pow(-1));
			// The value C is -c / a
			var C = this[0].times(this[2].pow(-1)).times([-1, 0]);
			// The new factor is z = A + sqrt(A^2 + C)
			newFactor = A.plus(A.pow(2).plus(C).pow(0.5));

			// remainder is (c + bx + ax^2)/(x - z)
			remainder = this.divide([newFactor.times([-1, 0]), 1]);

			// thing is an array containing the factors of the remainder
			var thing = remainder.factor();
			thing.push(newFactor);
			return Factored(thing);
			
		} else {
			console.log('No factors found');
			return this;
		}
	};

	poly.expand = function () {
		return this;
	};

	return poly;
}

function Factored (list) {
	var prod = list;

	prod.textVersion = function () {
		var str = '';
		list.forEach(function (elem, index) {
			if (index === 0) {
				if (elem.textVersion() !== '1') {
					str += elem.textVersion();
				}
			} else {
				if (elem.textVersion() === '0') {
					str += 'x';
				} else if (elem[0] > 0 && elem[1] === 0) {
					str += '(x - ' + (elem.textVersion()) + ')';
				} else {
					str += '(x + ' + (elem.times([-1, 0]).textVersion()) + ')';
				}
			}
		});
		return str;
	};

	prod.display = function () {
		console.log(this.textVersion());
		return this;
	};

	prod.expand = function () {
		return this.reduce( function (prev, current, index) {
			if (index === 0) {
				return Polynomial([current]);
			} else {
				return prev.times([current.times([-1, 0]), [1, 0]]);
			}
		}, Polynomial([]));
	};

	return prod;
}

module.exports = Polynomial;