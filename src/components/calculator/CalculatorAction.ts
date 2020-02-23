/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable class-methods-use-this */
import ExpressionHandler from '../expression/ExpressionHandler';
import ResultHandler from '../result/ResultHandler';

export default class CalculatorAction {
  private expressionHandler: ExpressionHandler;

  private resultHandler: ResultHandler;

  constructor(expressionHandler: ExpressionHandler, resultHandler: ResultHandler) {
    this.expressionHandler = expressionHandler;
    this.resultHandler = resultHandler;
  }

  // eslint-disable-next-line no-unused-vars
  addDigit(digit: number) {}

  addDot() {}

  addSign() {}

  backspace() {}

  clear() {}

  result() {}

  output() {}
}
