import AlignmentType from './Alignment';
import PositionType from './Position';

import {
  ActionType,
  OperationType,
  KeyType,
} from './Button';

export enum SingularAttribute {
  Alignment = 'alignment',
  Position = 'position',
  Operation = 'operation',
  Action = 'action',
  Key = 'key',
  Label = 'label',
  ClassName = 'className',
}

export enum PluralAttribute {
  Operations = 'operations',
  Actions = 'actions',
  Keys = 'keys',
  Labels = 'labels',
  ClassNames = 'classNames',
}

interface IteratorResult<T> {
  done: boolean;
  value: T;
}

export interface ButtonConstituent {
  action: ActionType;
  alignment: AlignmentType;
  operation: OperationType;
  position: PositionType;
  key: KeyType;
  label: string;
  className: string;
}

export class ButtonConstituents implements Iterable<ButtonConstituent> {
  actions: ActionType[] = [];

  alignment: AlignmentType = AlignmentType.Left;

  operations: OperationType[] = [];

  position: PositionType = PositionType.Top;

  keys: KeyType[] = [];

  labels: string[] = [];

  classNames: string[] = [];

  getCount(): number {
    return this.operations.length;
  }

  getItem(index: number): ButtonConstituent {
    return {
      action: this.actions[index] ?? this.actions[0],
      alignment: this.alignment,
      operation: this.operations[index],
      position: this.position,
      key: this.keys[index] ?? this.keys[0],
      label: this.labels[index] ?? this.labels[0],
      className: this.classNames[index] ?? this.classNames[0],
    };
  }

  [Symbol.iterator](): Iterator<ButtonConstituent> {
    let index = 0;
    return {
      next: (): IteratorResult<ButtonConstituent> => {
        let result: IteratorResult<ButtonConstituent>;
        if (index < this.getCount()) {
          result = {
            value: this.getItem(index),
            done: false,
          };
        } else {
          result = { value: undefined, done: true };
        }
        index += 1;
        return result;
      },
    };
  }
}
