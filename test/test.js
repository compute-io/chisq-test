/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Module to be tested:
	chisqTest = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-chisq-test', function tests() {

	it( 'should export a function', function test() {
		expect( chisqTest ).to.be.a( 'function' );
	});

	it( 'should throw an error if the first argument is neither array-like or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				chisqTest( value );
			};
		}
	});


	it( 'should return an error if provided a correct option which is not a boolean primitive', function test() {
		var data, values, err;

		data = matrix( new Int32Array([4,7,4,4]), [2,2] );

		values = [
			'5',
			5,
			function(){},
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				chisqTest( data, {
					'correct': value
				});
			};
		}

	});

	it( 'should throw an error if provided a probs array that does not have the same number of elements as x', function test() {
		expect( badValue ).to.throw( TypeError );
		function badValue(){
			chisqTest( [ 2, 2, 2 ], {
				'probs': [ 0.25, 0.25, 0.25, 0.25]
			});
		}
	});

	it( 'should test an array of counts against a uniform distribution', function test() {
		var data, actual;

		data = [ 2, 4, 5, 3, 8, 2 ];
		actual = chisqTest( data );

		assert.strictEqual( actual.df, 5 );
		assert.strictEqual( actual.T, 6.5 );
		assert.closeTo( actual.pValue, 0.26055, 1e-4 );
	});

	it( 'should test an array of counts against a custom distribution', function test() {
		var data, actual;

		data = [ 2, 4, 5, 3, 8, 2 ];
		actual = chisqTest( data, {
			'probs': [ 0.1, 0.1, 0.1, 0.1, 0.5, 0.1 ]
		});

		assert.strictEqual( actual.df, 5 );
		assert.closeTo( actual.T, 5.5, 1e-4 );
		assert.closeTo( actual.pValue, 0.35794, 1e-4 );
	});

	it( 'should print a formatted output via .toString() method when `x` is an array', function test() {
		var data, actual;

		data = [ 2, 4, 5, 3, 8, 2 ];
		actual = chisqTest( data, {
			'probs': [ 0.1, 0.1, 0.1, 0.1, 0.5, 0.1 ]
		});

		expect( actual.toString() ).to.be.a.string;
	});

	it( 'should calculate the chi-squared test of independence when provided a matrix', function test() {
		var data, actual;
		data = matrix( new Int32Array([200,150,50,250,300,50]), [2,3] );
		actual = chisqTest( data, {
			'correct': false
		});
		assert.strictEqual( actual.df, 2 );
		assert.closeTo( actual.T, 16.2037, 1e-4 );
		assert.closeTo( actual.pValue, 0.0003, 1e-4 );
	});

	it( 'should calculate the chi-squared test of independence using Yates\' continuity correction when provided a matrix', function test() {
		var data, actual;
		data = matrix( new Int32Array([4,7,4,4]), [2,2] );

		actual = chisqTest( data, {
			'correct': true
		});

		assert.strictEqual( actual.df, 1 );
		assert.closeTo( actual.T, 0.0153, 1e-4 );
		assert.closeTo( actual.pValue, 0.9014, 1e-4 );
	});


	it( 'should print a formatted output via .toString() method when `x` is a matrix', function test() {
		var data, actual;

		data = matrix( new Int32Array([4,7,4,4]), [2,2] );
		actual = chisqTest( data );

		expect( actual.toString() ).to.be.a.string;
	});

});
