
export interface ResultState {
  value: number;
  showResult: boolean;
}

export class ResultHandler {
  #result: ResultState;

  constructor(result: ResultState) {
    this.#result = result;
  }

  get value(): number {
    return this.#result.value;
  }
}
