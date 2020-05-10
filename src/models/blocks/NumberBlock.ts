import BaseBlock from './BaseBlock';
import { addCommas } from '../../common/utils';

export default class NumberBlock extends BaseBlock {
  static readonly MAX_VALUE_LENGTH = 13;

  addDigit(digit: string | number) {
    const { value } = this;
    const newValue = digit.toString();
    if (value === '0') {
      this.value = (newValue === '0' ? value : newValue);
    } else if (this.value.length < NumberBlock.MAX_VALUE_LENGTH) {
      this.value += newValue;
    }
  }

  addDot(dot: string) {
    const { value } = this;
    const { length } = value;
    if (length > 0
      && length < (NumberBlock.MAX_VALUE_LENGTH - 1)
      && !/\./.test(value)
    ) {
      this.value += dot;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getClassName(): string {
    return 'number';
  }

  formattedValue(): string {
    return addCommas(this.value);
  }
}
