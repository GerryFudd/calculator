var tol = 15;

function checkIfInt (argument) {
	var i = argument;
	var j = -i;
	var test = Math.floor(i);
	var jest = Math.floor(j);
	if (i.toFixed(tol) === test.toFixed(tol)) {
		i = 0 + test;
	} else if (j.toFixed(tol) === jest.toFixed(tol)) {
		i = 0 - jest;
	}
	return i;
}

function PolarNumber(a, b) {
	var th;
	if (b > 1 || b < -1) {
		var c = (b + 1) / 2;
		th = (c - Math.floor(c)) * 2 - 1;
	} else {
		th = b;
	}
	var number = [a, th];

	number.textVersion = function () {
		var value0 = 0 + this[0];
		var value1 = 0 + this[1];
		return value0 + 'e^(' + value1 + decodeURI(encodeURI('\u03C0')) + 'i)'
	};

	number.display = function () {
		console.log(this.textVersion());
		return this;
	};

	number.rectangular = function () {
		var r = this[0] * Math.cos(Math.PI * this[1]);
		var i = this[0] * Math.sin(Math.PI * this[1]);
		return ComplexNumber(r, i);
	};

	number.times = function(arr) {
		var r = this[0] * arr[0];
		var th = this[1] + arr[1];
		return PolarNumber(r, th);
	};

	number.pow = function (num) {
		var r = Math.pow(this[0], num);
		var th = this[1] * num;
		return PolarNumber(r, th);
	};

	return number;
}

function ComplexNumber(a, b) {
	var real = checkIfInt(a);
	var imaginary = checkIfInt(b);
	var number = [real, imaginary];

	number.textVersion = function () {
		var value0 = 0 + this[0];
		var value1 = 0 + this[1];
		var str = '';
		if (value1 === 1) {
			value1 = '';
		}
		if (value1 === 0) {
			str += value0;
		} else if (value0 === 0) {
			str += value1 + 'i';
		} else {
			str += value0 + ' + ' + value1 + 'i';
		}
		return str;
	};

	number.display = function () {
		console.log(this.textVersion());
		return this;
	};

	number.plus = function(arr) {
		var r = this[0] + arr[0];
		var i = this[1] + arr[1];
		return ComplexNumber(r, i);
	};

	number.conjugate = function () {
		var r = this[0];
		var i = -this[1];
		return ComplexNumber(r, i);
	};

	number.times = function (arr) {
		var r = this[0] * arr[0] - this[1] * arr[1];
		var i = this[0] * arr[1] + this[1] * arr[0];
		return ComplexNumber(r, i);
	};

	number.mod = function () {
		return Math.sqrt(this.times(this.conjugate())[0]);
	};

	number.polar = function() {
		var r = this.mod();
		if (r === 0) {
			return PolarNumber(r, 0);
		} else {
			var th;
			if (this[1] >= 0) {
				th = Math.acos(this[0] / r) / Math.PI;
			} else {
				th = - Math.acos(this[0] / r) / Math.PI;
			}
			return PolarNumber(r, th);
		}
	};

	number.pow = function (num) {
		return this.polar().pow(num).rectangular();
	};

	return number;
}

module.exports = ComplexNumber;