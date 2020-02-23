import BaseBlock from './BaseBlock';
import { addCommas } from '../../common/utils';

export default class NumberBlock extends BaseBlock {
  // eslint-disable-next-line class-methods-use-this
  className(): string {
    return 'number';
  }

  formattedValue(): string {
    return addCommas(this._value);
  }
}
