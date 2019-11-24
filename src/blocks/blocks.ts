

abstract class Block {

  static counter: number = 0;
  protected _id: string;
  protected _value: string;

  get id(): string {
    return this._id;
  }

  abstract format(): string;

  beforeOpenBracket(): boolean {
    return true;
  }

  beforeClosedBracket(): boolean {
    return true;
  }
}
