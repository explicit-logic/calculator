
export class BaseBlock {

  static _counter: number = 0;
  private _id: string;
  protected _value: string;

  constructor(value: string) {
    this._id = 'blk_' + BaseBlock._counter;
    BaseBlock._counter++;

    this._value = value;
  }

  get id(): string {
    return this._id;
  }

  get blockName(): string {
    return this.constructor.name;
  }

  className(): string {
    return 'block';
  }

  formattedValue(): string {
    return this._value;
  }

}
