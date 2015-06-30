chisq-test
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes a one-way or two-way [Pearson's chi-square test](https://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test)

## Installation

``` bash
$ npm install compute-chisq-test
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var chisqTest = require( 'compute-chisq-test' );
```

#### chisqTest( x[, opts] )
This function is used to compute a goodness-of-fit test when `x` is an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), treating it as a vector of observed frequencies. When `x` is a [`matrix`](https://github.com/dstructs/matrix), it is assumed to be a contingency table of observed frequencies, and a two-way [chi-square test](https://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test) for independence is computed.

The functions returns an [`object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) holding the `pValue` of the test, the calculated test statistic `T` and the degrees of freedom of the test (`df`).

```javascript
var matrix = require( 'dstructs-matrix' ),
	counts,
	mat,
	out;

// Example: does data come from a fair dice?
counts = [ 10, 8, 12, 15, 8, 9 ];
out = chisqTest( counts );
/*
{ T: ~3.613,
  df: 5,
  pValue: ~0.606 }
*/

/*
Example: is there an association between voting preferences and gender?
Table:
Voting Preferences
		Republican 	Democrat 	Independent
Male 	200 		150 		50
Female 	250 		300 		50
*/
mat = matrix( new Int32Array([200,150,50,250,300,50]), [2,3] );
out = chisqTest( mat );
/*
{ T: ~16.2037,
  df: 2,
  pValue: ~0.0003 }
*/
```

The returned object comes with a `.toString()` method which when invoked will print a formatted output of the results of the hypothesis test. 

``` javascript
mat = matrix( new Int32Array([200,150,50,250,300,50]), [2,3] );
console.log( chisqTest( mat ).toString() );
/*
Two-way chi-square test for marginal independence.
	null hypothesis: there is no association between the variables.
	test statistic: 16.2037
	df: 2
	p-value: 0.0003
*/
```

By default, in the `array` case it is assumed that the assumed theoretical distribution is uniform over the categories. To supply any discrete distribution, use the `probs` option:

```javascript
// Example: does data come from loaded dice where a six has probability 1/2?
var counts = [ 10, 15, 17, 13, 7, 50 ];
var probs = [ 0.1, 0.1, 0.1, 0.1, 0.1, 0.5 ];
chisqTest( counts, {
	'probs': probs
});
/*
{ T: ~6.928,
  df: 5,
  pValue: ~0.226 }
*/
```

The `probs` option argument has to be a `probability array`, i.e. an array of non-negative values which sum to one.

To use [Yates' continuity correction](https://en.wikipedia.org/wiki/Yates%s_correction_for_continuity) in the [chi-square test](https://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test) of independence, set the `correct` option to `true`:

```javascript
mat = matrix( new Int32Array([4,7,4,4]), [2,2] );

out = chisqTest( mat )
/*
{ T: 0.3533
  df: 1,
  pValue: 0.5522 }
*/
out = chisqTest( mat, {
	'correct': true
});
/*
{ T: 0.0153,
  df: 1,
  pValue: 0.9014 }
*/
```

## Examples

``` javascript
var chisqTest = require( 'compute-chisq-test' ),
	matrix = require( 'dstructs-matrix' ),
	out,
	counts, probs,
	mat;

/*
Goodnes of Fit test:
example taken from: http://www.stat.yale.edu/Courses/1997-98/101/chigf.htm
*/
counts = [ 48, 35, 15, 3 ];
probs = [ 0.58, 0.345, 0.07, 0.005 ];

out = chisqTest(counts,{
	'probs': probs
});

/*
Chi-Square test of independence:
example taken from: 	http://stattrek.com/chi-square-test/independence.aspx?Tutorial=AP

Table:
Voting Preferences
		Republican 	Democrat 	Independent
Male 	200 		150 		50
Female 	250 		300 		50
*/

mat = matrix( new Int32Array([200,150,50,250,300,50]), [2,3] );

// without Yates continuity correction
out = chisqTest( mat, {
	'correct': false
});

/*
with Yates continuity correction,
suggested when at least one cell of the table has an expected count < 5
*/
out = chisqTest( mat, {
	'correct': true
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2014-2015. The [Compute.io](https://github.com/compute-io) Authors.

[npm-image]: http://img.shields.io/npm/v/compute-chisq-test.svg
[npm-url]: https://npmjs.org/package/compute-chisq-test

[travis-image]: http://img.shields.io/travis/compute-io/chisq-test/master.svg
[travis-url]: https://travis-ci.org/compute-io/chisq-test

[coveralls-image]: https://img.shields.io/coveralls/compute-io/chisq-test/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/chisq-test?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/chisq-test.svg
[dependencies-url]: https://david-dm.org/compute-io/chisq-test

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/chisq-test.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/chisq-test

[github-issues-image]: http://img.shields.io/github/issues/compute-io/chisq-test.svg
[github-issues-url]: https://github.com/compute-io/chisq-test/issues
