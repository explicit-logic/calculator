/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ActionHandler from '../handlers/ActionHandler';
import { OperationType } from '../models/Button';
import { calculatorType } from '../reducers/calculator';

export default class CalculatorService {
  #actionHandler: ActionHandler;

  constructor(state: calculatorType) {
    this.#actionHandler = new ActionHandler(state);
  }

  runAction(action: keyof ActionHandler, operation: OperationType) {
    return this.#actionHandler[action](operation);
  }
}
