	'use strict';

// MODULES //

var isMatrixLike = require( 'validate.io-matrix-like' ),
	isArrayLike = require( 'validate.io-array-like' ),
	sum = require( 'compute-sum' ),
	divide = require( 'compute-divide' ),
	multiply = require( 'compute-multiply' ),
	outer = require( 'compute-outer' ),
	power = require( 'compute-power' ),
	min = require( 'compute-min' ),
	roundn = require( 'compute-roundn' ),
	subtract = require( 'compute-subtract' ),
	abs = require( 'compute-abs' ),
	chisqCDF = require( 'jStat' ).jStat.chisquare.cdf;


// FUNCTIONS //

var validate = require( './validate.js' );


// CHI-SQUARE TEST //

/**
* FUNCTION: chisqTest( x[, opts] )
*	Computes a one-way or two-way chi-square test.
* @param {Array|Matrix} x - an integer array holding observed counts of a discrete random variable or a matrix representing a 2x2 contingency table
* @param {Object} [opts] - function options
* @param {Boolean} [opts.correct=false]  boolean indicating whether to use Yates' continuity correction when `x` is a 2x2 contingency table
* @param {Array} [opts.probs] - array of theoretical distribution to test against when `x` is an array. Default: [ 1/x.length,..., 1/x.length ]
* @returns {Object} result object with properties `T`, `df` and `pValue`, holding the calculated test statistic, the degrees of freedom of the test and the p-value
*/
function chisqTest( x, options ) {

	var opts = {}, err,
		nRow, nCol,
		N,
		summands,
		stat, pval, param,
		rowSums, colSums,
		means, probs,
		base,
		absDiff,
		s, i,
		yates,
		nullHypothesis;

	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	if ( isMatrixLike( x ) ) {
		nRow = x.shape[ 0 ];
		nCol = x.shape[ 1 ];

		N = sum( sum( x ) );
		colSums = sum( x, {
			'dim': 1
		});
		rowSums = sum( x, {
			'dim': 2
		});

		means = divide( outer( rowSums, colSums ), N );
		absDiff = abs( subtract( x, means ) );
		if ( opts.correct && nRow === 2 && nCol === 2 ) {
			yates = Math.min( 0.5, min( absDiff.data ) );
		} else {
			yates = 0;
		}
		base = subtract( absDiff, yates );
		summands = divide( power( base, 2 ), means );
		stat = sum( sum( summands ) );
		param = ( nRow - 1 ) * ( nCol - 1 );
		pval = 1 - chisqCDF( stat, param );

		return {
			'T': stat,
			'df': param,
			'pValue': pval,
			'toString': function() {
				s = 'Two-way chi-square test for marginal independence.\n';
				s += '\tnull hypothesis: there is no association between the variables.\n';
				s += '\ttest statistic: ' + roundn( stat, -4 ) + '\n';
				s += '\tdf: ' +  param + '\n';
				s += '\tp-value: ' + roundn( pval, -4 );
				s += '\n';
				return s;
			}
		};
	}
	if ( isArrayLike( x ) ) {
		if ( !opts.probs ) {
			probs = new Array( x.length );
			for ( i = 0; i < x.length; i++ ) {
				probs[ i ] = 1 / x.length;
			}
			nullHypothesis = 'values occur in each category with equal frequency';
		} else {
			probs = opts.probs;
			if ( probs.length !== x.length ) {
				throw new TypeError( 'chisqTest()::invalid option. Probs options must be an array with the same number of elements as `x`. Value: `' + probs + '`.' );
			}
			nullHypothesis = 'the empirical distribution does not differ from the theoretical distribution given by `probs`';
		}
		means = multiply( sum( x ), probs );
		summands = divide( power( subtract( x, means ), 2 ), means );
		stat = sum( summands );
		param = x.length - 1;
		pval = 1 - chisqCDF( stat, param );

		return {
			'T': stat,
			'df': param,
			'pValue': pval,
			'toString': function() {
				s = 'One-way chi-square goodness-of-fit test.\n';
				s += '\tnull hypothesis: ' + nullHypothesis + '.\n';
				s += '\ttest statistic: ' + roundn( stat, -4 ) + '\n';
				s += '\tdf: ' +  param + '\n';
				s += '\tp-value: ' + roundn( pval, -4 );
				s += '\n';
				return s;
			}
		};
	}
	throw new TypeError( 'chisqTest()::invalid input argument. `x` must be either array-like or matrix-like. Value: `' + x + '`.'); 
} // end FUNCTION chisqTest()


// EXPORTS //

module.exports = chisqTest;
