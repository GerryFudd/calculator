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
			if (current === 0) {
				res = prev;
			} else {
				if (index === 0) {
					res = prev + current;
				} else if (index === 1) {
					res = prev + current + 'x';
				} else {
					res = prev + current + 'x^' + index;
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
		return this.reduce(function (prev, current, ind) {
			return prev + current * Math.pow(num, ind);
		});
	}

	return poly;
	
}

module.exports = Polynomial;