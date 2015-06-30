'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isNumberArray = require( 'validate.io-number-primitive-array'),
	sum = require( 'compute-sum' );


// CONSTANTS //

var EPSILON = 2.220446049250313e-16;

// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination for validated options
* @param {Object} options - function options
* @param {Boolean} [options.correct] - boolean indicating whether to apply Yates' continuity correction for 2x2 tables
* @returns {Null|Error} null or an error
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'chisqTest()::invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'correct' ) ) {
		opts.correct = options.correct;
		if ( !isBoolean( opts.correct ) ) {
			return new TypeError( 'chisqTest()::invalid option. Correct option must be a boolean primitive. Option: `' + opts.correct + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'probs' ) ) {
		opts.probs = options.probs;
		if ( !isNumberArray( opts.probs ) || Math.abs( sum( opts.probs ) - 1 ) > EPSILON ) {
			return new TypeError( 'chisqTest()::invalid option. Probs option must be a probability array, i.e. its elements must be non-negative numbers and sum to one. Option: `' + opts.probs + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
