var ComplexNumber = require('./complexNumber.js');
var Polynomial = require('./polynomial.js');

var z = ComplexNumber(0, -2);
Polynomial([2, z, 3]).display().factor().display().expand().display();