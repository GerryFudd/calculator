# Complex Calculator

This is a node module that can deal with complex numbers and complex polynomial functions.

## Installation

```bash
npm install complex-calculator
```

## Usage

There are two classes exposed by this module, `ComplexNumber` and `Polynomial`.

### The `ComplexNumber` class

The constructor takes a real number and an imaginary number as arguments.

```JavaScript
import {ComplexNumber} from 'complex-calculator';

const a = new ComplexNumber(-1, 1);
const b = new ComplexNumber(1, 1);
console.log(a.textVersion()) // -1 + i
console.log(b.textVersion()) // 1 + i
console.log(a.times(b).textVersion()) // -2
console.log(a.plus(b).textVersion()) // 2i
```

#### Constructor

- Arguments
  - real (Number)
  - imaginary (Number)

#### Attributes

`real` (Number): the real part of the complex number.

`imaginary` (Number): the imaginary part of the complex number.

#### Methods

`conjugate`: returns the complex conjugate of the number.
- Returns: ComplexNumber

`display`: logs the text version of the number and returns the number (for debugging in the middle of long computations).
- Returns: ComplexNumber

`mod`: returns the modulus (or size) of the complex number.
- Returns: Number

`polar`: returns the polar representation of the complex number. This is its own data structure with its own API.
- Returns: PolarNumber

`pow`: raises the complex number to a real exponent.
- Arguments:
  - exponent (Number)
- Returns: ComplexNumber

`plus`: performs complex number addition.
- Arguments:
  - summand (ComplexNumber | Array)<sup>1</sup>
- Returns: ComplexNumber
  
`textVersion`: returns a string that is formatted the way that the complex number would be written longhand.
- Returns: String

`times`: performs complex number multiplication.
- Arguments:
  - multiplicand (ComplexNumber | Array)<sup>1</sup>
- Returns: ComplexNumber

### The `PolarNumber` class

This class is not directly exposed, but rather it is accessed via the ComplexNumber class.

```JavaScript
import {ComplexNumber} from 'complex-calculator';

const a = new ComplexNumber(-1, 1);
const b = new ComplexNumber(1, 1);

console.log(a.polar().textVersion()) // 1.4142135623730951e^(0.75πi)
console.log(a.polar().times(b.polar()).textVersion()) // 2.0000000000000004e^(1πi) <- Thanks, floating point arithmetic in base 2 :(
console.log(a.polar().times(b.polar()).rectangular().textVersion()) // -2
``` 

#### Attributes

`r` (Number): the distance from the origin to the complex number.

`th` (Number): a numerical representation of the polar angle that is formed by the complex number. Multiplying this number by π will result in the radian measurement of the angle. More directly, it is the fraction of a half rotation. This will always be a number such that `0 <= a.th && a.th < 2`.

#### Methods

`display`: logs the textVersion of the polar number and returns the polar number.
- Returns: PolarNumber

`pow`: raises the polar number to a real exponent.
- Arguments:
  - exponent (Number)
- Returns: PolarNumber

`rectangular`: returns the complex number that corresponds to the polar number.
- Returns: ComplexNumber

`textVersion`: returns a string of the form `re^(θi)` where `r` is the modulus of the polar number and `θ` is the angle of the polar number in radians.
- Returns: String

`times`: multiplies the polar number by another polar number.
- Arguments:
  - multiplicand (PolarNumber | Array)<sup>2</sup>
- Returns: PolarNumber

### The `Polynomial` class

```JavaScript
import {Polynomial, ComplexNumber} from 'complex-calculator';

const p = new Polynomial([-1, 0, 1]);

console.log(p.textVersion()) // -1 + x^2
console.log(p.factor().textVersion()) // (x + 1)(x - 1)

const a = new ComplexNumber(-2, 4);
const q = new Polynomial([a, [1, 2], 1]);
console.log(q.textVersion()) // (-2 + 4i) + (1 + 2i)x + x^2
console.log(q.factor().textVersion()) // (x + 2)(x + -1 + 2i)
```

#### Constructor

- Arguments:
  - coefficients ((Number | ComplexNumber | Array)<sup>1</sup>[])

#### Attributes

`coefficients` (ComplexNumber[]): the list of coefficients of the polynomial. The index of each element of the list corresponds to the order of the term for that coefficient.

`degree` (Number): the largest power that appears in any of the terms of the polynomial.

#### Methods

`display`: logs the textVersion of the polynomial and returns the polynomial.
- Returns: Polynomial

`divide`: divides the polynomial by another polynomial and returns just the quotient (similar to the way that integer division works in c based languages).
- Arguments:
  - divisor (Polynomial | Array)<sup>3</sup>
- Returns: Polynomial

`division`[sic]: divides the polynomial by another polynomial. The result is represented as a quotient and a remainder.

    _.isEqual(p.division(q), {quotient: r, remainder: s})

exactly when

    _.isEqual(p, q.times(r).plus(s))

- Arguments:
  - divisor (Polynomial | Array)<sup>3</sup>
- Returns: {quotient: Polynomial, remainder: Polynomial}

`evaluate`: returns the output of the polynomial function for a given input.
- Arguments:
  - input (ComplexNumber | Number)<sup>4</sup>
- Returns: ComplexNumber

`expand`: returns the polynomial (used for consistency when using `factor`).
- Returns: Polynomial

`factor`: returns a factored representation of the polynomial if the polynomial's degree is less than or equal to 3.
- Returns: (ComplexNumber | Polynomial)

`plus`: adds the polynomial function to another polynomial function.
- Arguments:
  - summand (Polynomial | Array)<sup>3</sup>
- Returns: Polynomial

`push`: adds another term to the polynomial with an order one higher than the current degree of the polynomial.
- Arguments
  - coefficient (ComplexNumber)
- Returns: `undefined`

`remainder`: divides the polynomial by another polynomial and returns just the remainder (similar to the modulus of two integers).
- Arguments:
  - divisor (Polynomial | Array)<sup>3</sup>
- Returns: Polynomial

`textVersion`: a string representing the way that a person would write the polynomial long hand. Uses "^" to denote exponentiation.
- Returns: String

`times`: multiplies the polynomial function by another polynomial function.
- Arguments:
  - multiplicand (Polynomial | Array)<sup>3</sup>
- Returns: Polynomial

### The `Factored` class

This is another class that is only indirectly exposed.

#### Attributes

`factors` (ComplexNumber[]): this is a slight misnomer in a mathematical sense. The first element in this array is the coefficient of the largest order term of the polynomial. The remaining values are the input values of the factored polynomial that will result in an output of 0.

#### Methods

`display`: logs the textVersion of the factored polynomial and returns the factored polynomial.
- Returns: Factored

`expand`: returns the polynomial that the factored polynomial came from.
- Returns: Polynomial

`textVersion`: a string representing the polynomial as a product of binomials. If the factored polynomial has `factors` [a<sub>0</sub>,a<sub>1</sub>,...,a<sub>n</sub>], then the string will look like a<sub>0</sub>(x + -a<sub>1</sub>)...(x + -a<sub>n</sub>).

Note that a<sub>0</sub> is not a factor. It was merely convenient to use the 0th element of the `factors` array for this value.
- Returns: String

___
1: If the argument is an array, it will be interpreted as `[<real part>, <imaginary part>]`.

2: If the argument is an array, it will be interpreted as `[<modulus>, <angle>]` where the angle will be the `th` attribute of the polar number.

3: If the argument is an array, it will be interpreted as `new Polynomial(argument)`.

4: If the argument is a Number, it will be interpreted as `new ComplexNumber(argument, 0)`.
