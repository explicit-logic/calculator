import BaseBlock from '../models/blocks/BaseBlock';
import { expressionType } from '../reducers/expression';
// import NumberBlock from '../models/blocks/NumberBlock';
// import SignBlock from '../models/blocks/SignBlock';

export default class ExpressionHandler {
  #expression: expressionType;

  constructor(expression: expressionType) {
    this.#expression = expression;
  }

  get bracketCount(): number {
    return this.#expression.bracketCount;
  }

  get expression(): expressionType {
    return this.#expression;
  }

  getLastBlock(): BaseBlock {
    return this.#expression.blocks[this.#expression.blocks.length - 1];
  }

  formattedExpression(): string[] {
    const formattedExpression: string[] = [];

    for (const block of this.#expression.blocks) {
      formattedExpression.push(block.formattedValue());
    }
    return formattedExpression;
  }

  static checkRelation(firstBlock: BaseBlock, secondBlock: BaseBlock): boolean {
    if (firstBlock.blockName === secondBlock.blockName) {
      const concatValue = firstBlock.value + secondBlock.value;

      if (concatValue === ')(') {
        return false;
      }

      if (['((', '))'].includes(concatValue)) {
        return true;
      }

      return (firstBlock.value === ')' || secondBlock.value === '(');
    }

    return (firstBlock.value !== ')' && secondBlock.value !== '(');
  }

  static addBlock(block: BaseBlock) {
    return {
      type: 'addBlock',
      block,
    };
  }

  static updateBlock(block: BaseBlock, method: string, operator?: string | number) {
    block.runMethod(method, operator);
    return {
      type: 'updateBlock',
      block,
    };
  }

  static replaceBlock(searchBlock: BaseBlock, replaceBlock: BaseBlock) {
    return {
      type: 'replaceBlock',
      searchBlock,
      replaceBlock,
    };
  }

  static removeBracket(block: BaseBlock) {
    return {
      type: 'removeBracket',
      block,
    };
  }

  static removeBlock(block: BaseBlock) {
    return {
      type: 'removeBlock',
      block,
    };
  }

  static addOpenBracket(block: BaseBlock) {
    return {
      type: 'addOpenBracket',
      block,
    };
  }

  static addCloseBracket(block: BaseBlock) {
    return {
      type: 'addCloseBracket',
      block,
    };
  }

  static clear() {
    return {
      type: 'clear',
    };
  }
}
