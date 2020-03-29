import IteratorResult from './IteratorResult';

export default class ObjectResult implements IteratorResult<object> {
  done: boolean;

  value: object;

  constructor(done: boolean, value: object) {
    this.done = done;
    this.value = value;
  }
}
