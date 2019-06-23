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

1: If the argument is an array, it will be interpreted as `[<real part>, <imaginary part>]`.

2: If the argument is an array, it will be interpreted as `[<modulus>, <angle>]` where the angle will be the `th` attribute of the polar number.