
export default class BaseBlock {
  static _counter = 0;

  #id: number;

  #value: string;

  constructor(value: string) {
    this.#id = BaseBlock._counter;
    BaseBlock._counter += 1;

    this.#value = value;
  }

  get id(): number {
    return this.#id;
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    this.#value = value;
  }

  get blockName(): string {
    return this.constructor.name;
  }

  // eslint-disable-next-line class-methods-use-this
  getClassName(): string {
    return 'block';
  }

  formattedValue(): string {
    return this.#value;
  }

  hasMethod(method: string): boolean {
    return (method in this);
  }

  runMethod(method: string, operation: string | number) {
    this[method](operation);
  }

  isLastCharEqualTo(char: string) {
    return (this.#value.slice(-1) === char);
  }

  removeLastChar() {
    this.#value = this.#value.slice(0, -1);
  }
}
