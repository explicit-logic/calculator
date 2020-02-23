import BaseBlock from '../../models/blocks/BaseBlock';

export default class ExpressionHandler {
  private _expression: BaseBlock[];

  private _setExpression: (expression: BaseBlock[]) => void;

  constructor(expression: BaseBlock[], setExpression: (expression: BaseBlock[]) => void) {
    this._expression = expression;
    this._setExpression = setExpression;
  }

  get expression(): BaseBlock[] {
    return this._expression;
  }

  formattedExpression(): string[] {
    const formattedExpression: string[] = [];

    for (const block of this._expression) {
      formattedExpression.push(block.formattedValue());
    }
    return formattedExpression;
  }

  addBlock(block: BaseBlock): void {
    this._setExpression([...this._expression, block]);
  }
}
