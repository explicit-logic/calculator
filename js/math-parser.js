const NUMERIC_CHARSET = '01234567890.',
      ALPHA_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_',
      OPERATOR_CHARSET = '+-/*^%',
      WHITE_SPACE_REGEX = /\s/;

const MathFunctions = {
    sin: radians => Math.sin(radians),
    cos: radians => Math.cos(radians),
    tan: radians => Math.tan(radians),
    fact: value => {
        var iter,
            multiplier,
            returnValue = value;

        for(multiplier = value - 1; multiplier > 0; --multiplier) {
            returnValue *= multiplier;
        }

        return returnValue;
    },
    exp: value => Math.exp(value),
    sqrt: value => Math.sqrt(value),
    ceil: value => Math.ceil(value),
    floor: value => Math.floor(value),
    abs: value => Math.abs(value),
    acos: value => Math.acos(value),
    asin: value => Math.asin(value),
    atan: value => Math.atan(value),
    round: value => Math.round(value)
};

const Helpers = {
    isNumeric: char => NUMERIC_CHARSET.indexOf(char) !== -1,
    isAlpha: char => ALPHA_CHARSET.indexOf(char) !== -1,
    isOperator: char => OPERATOR_CHARSET.indexOf(char) !== -1,
    isMathFunction: keyword => typeof MathFunctions[keyword] === 'function',
    isWhitespace: char => WHITE_SPACE_REGEX.test(char),
    radians: angle => angle * Math.PI / 180
};

const OperatorFunctions = {
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '/': (left, right) => left / right,
    '*': (left, right) => left * right,
    '%': (left, right) => left % right,
    '^': (left, right) => Math.pow(left, right)
};

function ExpressionParser() {
    'use strict';

    this.variables = {
        pi: Math.PI,
        PI: Math.PI,
        e: Math.E,
        E: Math.E,
        rand: () => Math.random()
    };

    this.readOnlyVariables = Object.keys(this.variables).map(varName => varName);
};

/* Sets a variable */
ExpressionParser.prototype.setVariable = function(name, value) {
    'use strict';

    if(this.readOnlyVariables.indexOf(name) !== -1) {
        throw new Error('Error: Cannot set read only variable "' + name + '"');
    }

    this.variables[name] = value;
};

/* Gets a variable */
ExpressionParser.prototype.getVariable = function(name) {
    'use strict';

    if(this.isVariable(name)) {
        var variable = this.variables[name];

        if(typeof variable === 'function') {
            return variable();
        }

        return variable;
    }

    return undefined;
};

/* Checks if a variable exists */
ExpressionParser.prototype.isVariable = function(name) {
    'use strict';

    return this.variables.hasOwnProperty(name);
};

/* Parse an expression */
ExpressionParser.prototype.parse = function(expression) {
    'use strict';

    var tokens = this.tokenize(expression);

    tokens = this.parseTokens(tokens);

    var tokensLength = tokens.length,
        iter,
        value = null,
        last_number = null,
        flag_assignment = false;

    for(iter = 0; iter < tokensLength; ++iter) {
        // Get the value
        if(tokens[iter][0] === 'number') {
            value = tokens[iter][1];
        }

        if(tokens[iter][0] === 'assignment') {
            if(
                iter - 1 === 0 &&                   // Check there is a keyword previous
                iter + 1 < tokensLength &&          // Check there is a value to set next

                tokens[iter - 1][0] === 'keyword'
            ) {
                flag_assignment = true;
            } else {
                throw new Error('Error: Unexpected assignment');
            }
        }
    }

    if(flag_assignment) {
        this.setVariable(tokens[0][1], value);
    }

    return value;
};

/* Parse tokens */
ExpressionParser.prototype.parseTokens = function(tkns) {
    'use strict';

    var tokens = tkns;

    tokens = this.parseVariables(tokens);
    tokens = this.parseBrackets(tokens);
    tokens = this.parseNegatives(tokens);
    tokens = this.parseFunctions(tokens);
    tokens = this.parseOperations(tokens);

    return tokens;
};

ExpressionParser.prototype.parseBrackets = function(tkns) {
    'use strict';

    var tokens = tkns,
        tokensLength = tokens.length,
        bracketDepth = 0,
        bracketIndex = 0,
        iter;

    for(iter = 0; iter < tokensLength; ++iter) {
        if(tokens[iter][0] === 'bracket') {
            if(tokens[iter][1] === ')' && bracketDepth === 0) {
                throw new Error('Error: Invalid bracket syntax');
            }

            if(bracketDepth > 0) {
                if(tokens[iter][1] === ')') {
                    --bracketDepth;
                }

                if(bracketDepth === 0) {
                    let leftSide = tokens.slice(0, bracketIndex),
                        parsed = this.parseTokens(tokens.slice(bracketIndex + 1, iter)),
                        rightSide = tokens.slice(iter + 1);

                    tokens = leftSide.concat(parsed, rightSide);
                    iter += tokens.length - tokensLength;
                    tokensLength = tokens.length;
                }
            }

            if(tokens[iter][1] === '(') {
                if(bracketDepth === 0) {
                    bracketIndex = iter;
                }

                ++bracketDepth;
            }
        }
    }

    if(bracketDepth > 0) {
        throw new Error('Error: Invalid bracket syntax');
    }

    return tokens;
};

ExpressionParser.prototype.parseNegatives = function(tkns) {
    'use strict';

    var tokens = tkns,
        tokensLength = tokens.length,
        iter;

    for(iter = 0; iter < tokensLength; ++iter) {
        // Logic for a negative number
        if(
            tokens[iter][0] === 'operator' &&
            (
                tokens[iter][1] === '-' ||          // Check it's a minus symbol
                tokens[iter][1] === '+'             // Or a plus symbold
            ) &&
            (
                iter - 1 < 0 ||                     // Either there is no previous token...
                tokens[iter - 1][0] !== 'number'    // Or it's not a number
            ) &&
            iter + 1 < tokensLength &&              // Check there is a proceeding token
            tokens[iter + 1][0] === 'number'        // And it's a number
        ) {
            // Make the next number a negative
            tokens[iter + 1][1] = tokens[iter][1] === '-' ? -tokens[iter + 1][1] : tokens[iter + 1][1];
            // Remove this token from stack
            tokens.splice(iter, 1);
            --tokensLength;
            --iter;
            continue;
        }
    }

    return tokens;
};

ExpressionParser.prototype.parseVariables = function(tkns) {
    'use strict';

    var tokens = tkns,
        tokensLength = tokens.length,
        iter;

    for(iter = 0; iter < tokensLength; ++iter) {
        if(tokens[iter][0] === 'keyword') {
            if(
                !Helpers.isMathFunction(tokens[iter][1]) && // Check it's not a function
                (
                    iter === tokensLength - 1 ||            // Either this is the last token
                    tokens[iter + 1][0] !== 'assignment'    // Or the next token is not an assignment
                )
            ) {
                // Check variable exists
                if(this.isVariable(tokens[iter][1])) {
                    if(
                        iter - 1 >= 0 &&
                        tokens[iter - 1][0] === 'number'
                    ) {
                        tokens[iter][0] = 'number';
                        tokens[iter][1] = this.getVariable(tokens[iter][1]) * tokens[iter - 1][1];

                        let leftSide = tokens.slice(0, iter - 1),
                            rightSide = tokens.slice(iter);

                        tokens = leftSide.concat(rightSide);

                        --iter;
                        --tokensLength;
                    } else {
                        tokens[iter][0] = 'number';
                        tokens[iter][1] = this.getVariable(tokens[iter][1]);
                    }

                    continue;
                } else {
                    throw new Error('Error: Undefined variable "' + tokens[iter][1] + '"');
                }
            }
        }
    }

    return tokens;
};

ExpressionParser.prototype.parseFunctions = function(tkns) {
    'use strict';

    var tokens = tkns,
        tokensLength = tokens.length,
        iter;

    for(iter = 0; iter < tokensLength; ++iter) {
        if(tokens[iter][0] === 'keyword' && tokens[iter][1] in MathFunctions) {
            if(
                iter + 1 < tokensLength &&          // Check this is not the last token
                tokens[iter + 1][0] === 'number'    // And the last next token is a number
            ) {
                // Apply math function
                tokens[iter + 1][1] = MathFunctions[tokens[iter][1]](tokens[iter + 1][1]);
                // Remove this token from stack
                tokens.splice(iter, 1);
                --tokensLength;
                --iter;
            } else {
                throw new Error('Error: unexpected function "' + tokens[iter][1] + '"');
            }
        }
    }

    return tokens;
};

ExpressionParser.prototype.parseOperations = function(tkns) {
    'use strict';

    // Order of operations
    var operators = ['^', '/', '*', '+', '-'],
        tokens = tkns;

    operators.forEach(operator => {
        tokens = this.parseOperator(tokens, operator);
    });

    return tokens;
};

ExpressionParser.prototype.parseOperator = function(tkns, oprtr) {
    'use strict';

    var tokens = tkns,
        operator = oprtr,
        tokensLength = tokens.length,
        iter;

    for(iter = 0; iter < tokensLength; ++iter) {
        var token = tokens[iter],
            token_type = token[0],
            token_value = token[1];

        if(token_type === 'operator' && token_value === operator) {
            if(
                iter - 1 >= 0 &&                        // Check there is a previous token
                iter + 1 < tokensLength &&              // Check there is a next token
                tokens[iter - 1][0] === 'number' &&     // Check the previous token is a number
                tokens[iter + 1][0] === 'number'        // Check the next token is a number
            ) {
                tokens[iter + 1][1] = OperatorFunctions[token_value](tokens[iter - 1][1], tokens[iter + 1][1]);

                let leftSide = tokens.slice(0, iter - 1),
                    rightSide = tokens.slice(iter + 1);

                // Replace sub-expression with the result value
                tokens = leftSide.concat(rightSide);
                iter += tokens.length - tokensLength;
                tokensLength = tokens.length;

                continue;
            } else {
                throw new Error('Error: unexpected operator "' + tokens[iter][1] + '"');
            }
        }
    }

    return tokens;
};

/**
 * Split expression into tokens
 */
ExpressionParser.prototype.tokenize = function(expr) {
    'use strict';

    // TOKENIZER VARS
    var expression = expr + ' ', // Append space so that the last character before that space is tokenised
        expressionLength = expression.length,
        iter,
        tokens = [ ],
        buffer = '';

    // FLAGS
    var flag_numeric = false,
        flag_keyword = false,
        flag_operator = false,
		flag_sciNotation = true;

    // Iterate through expression
    for(iter = 0; iter < expressionLength; ++iter) {
        let char = expression.charAt(iter),
            char_isNumeric = Helpers.isNumeric(char),
            char_isOperator = Helpers.isOperator(char),
            char_isAlpha = Helpers.isAlpha(char);

        if(flag_keyword) {
            // We've reached the end of the keyword
            if(!char_isAlpha) {
                flag_keyword = false;
                tokens.push(['keyword', buffer]);
                buffer = '';
            }
        }

        if(flag_numeric) {
			// We've reached the end of the number
			if(!char_isNumeric) {
				if(char === 'e') {
					flag_sciNotation = true;
					buffer += char;
					continue;
				}

				if(flag_sciNotation && (char === '+' || char === '-')) {
					flag_sciNotation = false;
					buffer += char;
					continue;
				}

				// Skip char if comma, so we can allow for formatted numbers
				if(char === ',' && iter + 1 < expressionLength && Helpers.isNumeric(expression[iter + 1])) {
					continue;
				}

				let parsingFunction = parseInt;

				if(buffer.indexOf('.') !== -1) { // Check for float
					parsingFunction = parseFloat;
				}

				tokens.push(['number', Number(buffer)]);

				flag_numeric = false;
				flag_sciNotation = false;
				buffer = '';
			} else {
				flag_sciNotation = false;
			}
        }

        if(char_isNumeric) {                     // Check for a number
            flag_numeric = true;
            buffer += char;
        } else if(char_isAlpha) {                // Check for a keyword
            flag_keyword = true;
            buffer += char;
        } else if(char_isOperator) {             // Check for an operator
            tokens.push(['operator', char]);
        } else if(char === '(') {                // Check for parentheses
            tokens.push(['bracket', '(']);
        } else if(char === ')') {                // Check for closing parentheses
            tokens.push(['bracket', ')']);
        } else if(char === '=') {                // Check for assignment
            tokens.push(['assignment', char]);
        } else if(!Helpers.isWhitespace(char)) { // Check for whitespace
            throw new Error('Error: Unexpected char "' + char + '"');
        }
    }

    return tokens;
};

var ep = new ExpressionParser();

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(expression) {
    try {
        var result = ep.parse(expression);
        if(result !== false) {
            console.log(result);
        }
    } catch(e) {
        console.log(e.message);
    }

    process.stdout.write("> ");
});
console.log("Welcome to math2.js:");
process.stdout.write("> ");

/*
    TESTS:
        > (12*5/2+3-9*(sin(PI/2)*cos(PI/2)+tan(5+1))/3)+fact(5+1)
        753.8730185741542

        > b = 2.5
        2.5

        > 2b
        5

        > fact 2b
        120

        > sin (90*pi/180)
        1

        > floor(rand * 10) + 10         ; Random number from (inclusive) 10 to (exclusive) 20
        16
*/