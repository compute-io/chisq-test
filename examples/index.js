'use strict';

var chisqTest = require( './../lib' ),
	matrix = require( 'dstructs-matrix' ),
	out,
	counts, probs,
	mat;

/*
Goodnes of Fit test:
example from: http://www.stat.yale.edu/Courses/1997-98/101/chigf.htm
*/
counts = [ 48, 35, 15, 3 ];
probs = [ 0.58, 0.345, 0.07, 0.005 ];

out = chisqTest(counts,{
	'probs': probs
});
console.log( out.toString() );

/*
Chi-Square test of independence:
example from: 	http://stattrek.com/chi-square-test/independence.aspx?Tutorial=AP

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
console.log( out.toString() );

/*
with Yates continuity correction,
suggested when at least one cell of the table has an expected count < 5
*/
out = chisqTest( mat, {
	'correct': false
});
console.log( out.toString() );
