import { BaseBlock } from '../../models/blocks';

export class ExpressionHandler {
  private _expression: BaseBlock[];
  private _setExpression: (expression: BaseBlock[]) => void;

  constructor(expression: BaseBlock[], setExpression: (expression: BaseBlock[]) => void) {
    this._expression = expression;
    this._setExpression = setExpression;
  }

  formattedExpression(): string[] {
    let formattedExpression: string[] = [];

    for (const block of this._expression) {
      formattedExpression.push(block.formattedValue());
    }
    return formattedExpression;
  }

  addBlock(block: BaseBlock) {
    this._setExpression([...this._expression, block]);
  }
}
