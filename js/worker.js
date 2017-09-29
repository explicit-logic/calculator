importScripts('bignumber.min.js');
BigNumber.config({ POW_PRECISION: 100, EXPONENTIAL_AT: [-13, 120], DECIMAL_PLACES: 35, ROUNDING_MODE: 4  });

var evaluate=function(){
		var operators = {
		    '+': function(x, y){return (x.plus(y));},
		    '-': function(x, y){return (x ? x.minus(y) : y.times(-1));},
		    '*': function(x, y){return (x.times(y));},
		    '/': function(x, y){return ( x.dividedBy(y) );},
		    '^': function(x, y){return x.toPower(y);}
		};

		return function(expr){
		    var stack = [];
		    var k=0;
		    
		    expr.forEach(function(token){
		        if (token in operators) {
		            var y=stack.pop(), x= stack.pop();
		            stack.push(
		            	new BigNumber( operators[token](x, y) )
		            	);
		        }
		        else {
		            stack.push(new BigNumber(token));
		        }
		    });
		    return stack.pop();
		}
	}();

onmessage = function(e) {
  //console.log('Message received from main script');
  var workerResult='' + evaluate(e.data);
  //console.log('Posting message back to main script');
  postMessage(workerResult);
}