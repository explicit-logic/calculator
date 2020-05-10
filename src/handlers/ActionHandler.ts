/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable class-methods-use-this */
import ExpressionHandler from './ExpressionHandler';
import { ResultHandler } from './ResultHandler';
import { calculatorType } from '../reducers/calculator';
import NumberBlock from '../models/blocks/NumberBlock';
import SignBlock from '../models/blocks/SignBlock';

export default class ActionHandler {
  #expressionHandler: ExpressionHandler;

  #resultHandler: ResultHandler;

  constructor(state: calculatorType) {
    this.#expressionHandler = new ExpressionHandler(state.expression);
    this.#resultHandler = new ResultHandler(state.result);
  }

  addDigit(digit: string | number) {
    const lastBlock = this.#expressionHandler.getLastBlock();

    if (lastBlock) {
      if (lastBlock.hasMethod('addDigit')) {
        return ExpressionHandler.updateBlock(lastBlock, 'addDigit', digit);
      }

      const numberBlock = new NumberBlock(digit.toString());

      if (ExpressionHandler.checkRelation(lastBlock, numberBlock)) {
        return ExpressionHandler.addBlock(numberBlock);
      }

      return {};
    }

    return ExpressionHandler.addBlock(new NumberBlock(digit.toString()));
  }

  addDot() {
    const lastBlock = this.#expressionHandler.getLastBlock();

    if (lastBlock && lastBlock.hasMethod('addDot')) {
      return ExpressionHandler.updateBlock(lastBlock, 'addDot', '.');
    }

    return {};
  }

  addSign(sign: string | number) {
    const lastBlock = this.#expressionHandler.getLastBlock();
    const actions = [];

    if (lastBlock) {
      if (lastBlock.isLastCharEqualTo('-')) {
        return ExpressionHandler.removeBlock(lastBlock);
      }

      if (lastBlock.isLastCharEqualTo('.')) {
        actions.push(ExpressionHandler.updateBlock(lastBlock, 'removeLastChar'));
      }

      const signBlock = new SignBlock(sign.toString());
      if (ExpressionHandler.checkRelation(lastBlock, signBlock)) {
        actions.push(ExpressionHandler.addBlock(signBlock));
        return actions;
      }

      return {};
    }

    if (sign === '-') {
      return ExpressionHandler.addBlock(new NumberBlock('-'));
    }

    return {};
  }

  backspace() {
    const lastBlock = this.#expressionHandler.getLastBlock();
    if (lastBlock) {
      if (lastBlock.value.length > 1) {
        return ExpressionHandler.updateBlock(lastBlock, 'removeLastChar');
      }

      if (lastBlock.value === '(' || lastBlock.value === ')') {
        return ExpressionHandler.removeBracket(lastBlock);
      }

      return ExpressionHandler.removeBlock(lastBlock);
    }

    return {};
  }

  clear() {
    return ExpressionHandler.clear();
  }

  closeBracket() {
    const lastBlock = this.#expressionHandler.getLastBlock();
    if (this.#expressionHandler.bracketCount && lastBlock) {
      const bracketBlock = new SignBlock(')');
      if (ExpressionHandler.checkRelation(lastBlock, bracketBlock)) {
        return ExpressionHandler.addCloseBracket(bracketBlock);
      }
    }
    return {};
  }

  openBracket() {
    let lastBlock = this.#expressionHandler.getLastBlock();
    const actions = [];
    const bracketBlock = new SignBlock('(');
    if (lastBlock) {
      if (lastBlock.isLastCharEqualTo('-')) {
        const signMinusBlock = new SignBlock('-');
        actions.push(ExpressionHandler.replaceBlock(lastBlock, signMinusBlock));
        lastBlock = signMinusBlock;
      }

      if (ExpressionHandler.checkRelation(lastBlock, bracketBlock)) {
        actions.push(ExpressionHandler.addOpenBracket(bracketBlock));
        return actions;
      }

      return {};
    }

    return ExpressionHandler.addOpenBracket(bracketBlock);
  }

  result() {}

  output() {}
}
