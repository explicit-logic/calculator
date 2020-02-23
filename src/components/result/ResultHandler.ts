import { ResultState } from './ResultState';

export default class ResultHandler {
  private result: ResultState;

  private setResult: (result: ResultState) => void;

  constructor(result: ResultState, setResult: (result: ResultState) => void) {
    this.result = result;
    this.setResult = setResult;
  }

  get value(): number {
    return this.result.value;
  }

  set value(value: number) {
    this.result.value = value;
    this.setResult(this.result);
  }
}
