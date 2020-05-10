import BaseBlock from './BaseBlock';

export default class SignBlock extends BaseBlock {
  // eslint-disable-next-line class-methods-use-this
  getClassName(): string {
    return 'sign';
  }
}
