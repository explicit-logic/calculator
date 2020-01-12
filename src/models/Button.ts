import {Action} from './Action';
import {Alignment} from './Alignment';
import {Direction} from './Direction';

export type OperationType = string | number;
export type KeyType = number | number[];

export class Button {
  private _action: Action;
  private _alignment?: Alignment;
  private _className?: string;
  private _direction?: Direction;
  private _key?: KeyType;
  private _operation: OperationType;

  get action(): Action {
    return this._action;
  }
  set action(action: Action) {
    this._action = action;
  }

  get alignment(): Alignment {
    return this._alignment;
  }
  set alignment(alignment: Alignment) {
    this._alignment = alignment;
  }

  get className(): string {
    return this._className;
  }
  set className(className: string) {
    this._className = className;
  }

  get direction(): Direction {
    return this._direction;
  }
  set direction(direction: Direction) {
    this._direction = direction;
  }

  get key(): KeyType {
    return this._key;
  }
  set key(key: KeyType) {
    this._key = key;
  }

  get operation(): OperationType {
    return this._operation;
  }
  set operation(operation: OperationType) {
    this._operation = operation;
  }

}
