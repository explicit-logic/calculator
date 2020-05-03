import { expressionReducer, expressionType, expressionState } from './expression';
import { resultReducer, resultType, resultState } from './result';

export type calculatorType = {
  expression: expressionType;
  result: resultType;
};

export const calculatorState: calculatorType = {
  expression: expressionState,
  result: resultState,
};

export function calculatorReducer({ expression, result }, action) {
  return {
    expression: expressionReducer(expression, action),
    result: resultReducer(result, action),
  };
}
