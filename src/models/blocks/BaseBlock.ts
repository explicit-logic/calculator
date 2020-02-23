
export default class BaseBlock {
  static _counter = 0;

  private _id: string;

  protected _value: string;

  constructor(value: string) {
    this._id = `blk_${BaseBlock._counter}`;
    BaseBlock._counter += 1;

    this._value = value;
  }

  get id(): string {
    return this._id;
  }

  get blockName(): string {
    return this.constructor.name;
  }

  // eslint-disable-next-line class-methods-use-this
  className(): string {
    return 'block';
  }

  formattedValue(): string {
    return this._value;
  }
}
