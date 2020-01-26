import { BaseBlock } from './BaseBlock';
import { addCommas } from '../../common/utils';

export class NumberBlock extends BaseBlock {

  className(): string {
    return 'number';
  }

  formattedValue(): string {
    return addCommas(this._value);
  }

}
