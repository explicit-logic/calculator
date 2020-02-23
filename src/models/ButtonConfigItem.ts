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

export class ButtonConfigItem {
  _operations: OperationType[];

  _actions: ActionType[];

  _keys: KeyType[];

  _labels: string[];

  _classNames: string[];

  get actions(): ActionType[] {
    return this._actions;
  }

  set actions(actions: ActionType[]) {
    this._actions = actions;
  }

  get operations(): OperationType[] {
    return this._operations;
  }

  set operations(operations: OperationType[]) {
    this._operations = operations;
  }
}
