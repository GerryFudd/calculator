function PolarNumber(a, b) {
	var th;
	if (b > 1 || b < -1) {
		var c = (b + 1) / 2;
		th = (c - Math.floor(c)) * 2 - 1;
	} else {
		th = b;
	}
	var number = [a, th];

	number.display = function () {
		var rounded0 = Number(this[0].toFixed(15));
		var rounded1 = Number(this[1].toFixed(15));
		console.log(rounded0 + 'e^(' + rounded1 + decodeURI(encodeURI('\u03C0')) + 'i)');
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
	var number = [a, b];

	number.textVersion = function () {
		var rounded0 = Number(this[0].toFixed(15));
		var rounded1 = Number(this[1].toFixed(15));
		var str = '';
		if (rounded1 === 0) {
			str += rounded0;
		} else if (rounded0 === 0) {
			if (rounded1 === 1) {
				str += 'i';
			} else {
				str += rounded1 + 'i';
			}
		} else {
			str += rounded0 + ' + ' + rounded1 + 'i';
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