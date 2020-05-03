import BaseBlock from '../models/blocks/BaseBlock';

export default class ExpressionHandler {
  #expression: BaseBlock[];

  constructor(expression: BaseBlock[]) {
    this.#expression = expression;
  }

  get expression(): BaseBlock[] {
    return this.#expression;
  }

  formattedExpression(): string[] {
    const formattedExpression: string[] = [];

    for (const block of this.#expression) {
      formattedExpression.push(block.formattedValue());
    }
    return formattedExpression;
  }
}
