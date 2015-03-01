var ComplexNumber = require('./complexNumber.js')

function Polynomial (list) {
	var poly = list;
	
	var last = poly[poly.length - 1];
	while (last === 0) {
		poly.pop();
		last = poly[poly.length - 1];
	}	

	poly.degree = poly.length - 1;

	poly.display = function () {
		var str = this.reduce(function (prev, current, index) {
			var res;
			var coef;

			if (current === 1 && index !== 0) {
				coef = '';
			} else {
				coef = 0 + current;
			}

			if (current === 0) {
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
		console.log(str);
		return this;
	}

	poly.plus = function(arr) {
		var result = [];

		function add (short, long) {
			long.forEach(function (elem, index) {
				if (short[index]) {
					result[index] = elem + short[index];
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
	}

	poly.times = function(arr) {
		var result = [];

		this.forEach( function (elem, ind) {
			arr.forEach( function (element, index) {
				if (result[ind + index]) {
					result[ind + index] += elem * element;
				} else {
					result[ind + index] = elem * element;
				}
			})
		});

		return Polynomial(result);
	}

	poly.division = function (arr) {
		var quotient = Polynomial([]);
		if (this.length - arr.length >= 0) {
			var quotDeg = this.length - arr.length;
			var n;
			for (n = 0; n < quotDeg; n++) {
				quotient.push(0);
			}
			var coef = this[this.length - 1] / arr[arr.length - 1];
			quotient.push(coef);
		}
		var remainder = this.plus(quotient.times(arr).times([-1]));

		while (remainder.length >= arr.length) {
			quotDeg = remainder.length - arr.length;
			coef = remainder[remainder.length - 1] / arr[arr.length - 1];
			quotient[quotDeg] = coef;
			remainder = this.plus(quotient.times(arr).times([-1]));
		}

		return [Polynomial(quotient), remainder];
	}

	poly.divide = function (arr) {
		return this.division(arr)[0];
	}

	poly.remainder = function (arr) {
		return this.division(arr)[1];
	}

	poly.eval = function (num) {
		var result = this.reduce(function (prev, current, ind) {
			return prev + current * Math.pow(num, ind);
		});
		console.log(result);
		return result;
	}

	poly.factor = function () {
		var factors = [];
		var newFactor;
		var remainder;
		if (this.length !== 0) {
			factors.push(this[this.length - 1]);
		}

		if (this.length <= 1) {
			console.log('there are no factors');
			return this;
		} else if (this.length === 2) {
			newFactor = -this[0] / this[1];
			factors.push(newFactor);
			return Factored(factors);
		} else if (this.length === 3) {
			var A = ComplexNumber(-this[1] / (2 * this[2]), 0);
			var C = ComplexNumber(- this[0] / this[2], 0);
			newFactor = A.plus(A.pow(2).plus(C).pow(.5));
			if (newFactor[1] === 0) {
				remainder = this.divide(Polynomial([-newFactor[0], 1]));
				var thing = remainder.factor();
				thing.push(newFactor[0]);
				return Factored(thing);
			} else {
				console.log('Non real result');
				return this;
			}
			
		} else {
			console.log('No factors found');
			return this;
		}
	}

	return poly;
}

function Factored (list) {
	var prod = list;

	prod.display = function () {
		var str = '';
		list.forEach(function (elem, index) {
			if (index === 0) {
				if (elem !== 1) {
					str += elem;
				}
			} else {
				if (elem === 0) {
					str += 'x';
				} else if (elem < 0) {
					str += '(x + ' + (-elem) + ')';
				} else {
					str += '(x - ' + elem + ')';
				}
			}
		});
		console.log(str);
		return this;
	}

	prod.expand = function () {
		return this.reduce( function (prev, current, index) {
			if (index === 0) {
				return Polynomial([current]);
			} else {
				return prev.times([-current, 1]);
			}
		}, Polynomial([]));
	}

	return prod;
}

module.exports = Polynomial;