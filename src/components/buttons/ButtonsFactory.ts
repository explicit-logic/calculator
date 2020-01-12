import * as config from './buttonsConfig.json';

import { Action } from './../../models/Action';
import { Alignment } from './../../models/Alignment';
import { Position } from './../../models/Position';

import {
  Button,
  OperationType,
  KeyType } from './../../models/Button';

enum SingularAttribute {
  Alignment = 'alignment',
  Position = 'position',
  Operation = 'operation',
  Action = 'action',
  Key = 'key',
};

enum PluralAttribute {
  Operations = 'operations',
  Actions = 'actions',
  Keys = 'keys',
};

const ConfigItemAttributes = new Map<SingularAttribute, PluralAttribute>([
  [SingularAttribute.Operation, PluralAttribute.Operations],
  [SingularAttribute.Action, PluralAttribute.Actions],
  [SingularAttribute.Key, PluralAttribute.Keys],
]);

type ConfigPositionType = Position | [Position, Alignment];

interface BaseConfigItem {
  [SingularAttribute.Position]?: ConfigPositionType;
  [SingularAttribute.Action]?: Action;
  [PluralAttribute.Actions]?: Action[];
  [SingularAttribute.Key]?: KeyType;
  [PluralAttribute.Keys]?: KeyType[];
}

interface OperationConfigItem extends BaseConfigItem {
  [SingularAttribute.Operation]: OperationType;
}

interface OperationsConfigItem extends BaseConfigItem {
  [PluralAttribute.Operations]: OperationType[];
}

type ConfigItem = OperationConfigItem | OperationsConfigItem;

export class ButtonsFactory {
  buttonsTree: object;

  constructor() {
    this.buttonsTree = {};
  }

  addButtonToTree(
    button: Button,
    position: Position = Position.Top) {

    if (!this.buttonsTree.hasOwnProperty(position)) {
      this.buttonsTree[position] = {};
    }

    if (!this.buttonsTree[position].hasOwnProperty(button.alignment)) {
      this.buttonsTree[position][button.alignment] = [];
    }

    this.buttonsTree[position][button.alignment].push(button);
  }

  getButtonsByPosition(position: Position) {
    return this.buttonsTree[position];
  }

  init() {
    this.parseConfig();
  }

  parseConfigItem(item: ConfigItem) {
    let
      positionValue: ConfigPositionType,
      alignment: Alignment = Alignment.Left,
      position: Position = Position.Top,
      buttonsCount = 0,
      itemValues: { [key: string]: OperationType[] | Action[] | KeyType[] } = {};

    if (item.hasOwnProperty(SingularAttribute.Position)) {
      positionValue = item[SingularAttribute.Position];

      if (Array.isArray(positionValue)) {
        [position, alignment] = positionValue;
      } else {
        position = positionValue;
      }

      if (!Object.values(Position).includes(position)) {
        throw new Error('Incorrect buttons position');
      }
    }

    for (const [singularAttribute, pluralAttribute] of ConfigItemAttributes.entries()) {
      if (item.hasOwnProperty(singularAttribute)) {
        itemValues[pluralAttribute] = [item[singularAttribute]];
      } else if (item.hasOwnProperty(pluralAttribute)) {
        itemValues[pluralAttribute] = item[pluralAttribute];
      } else {
        itemValues[pluralAttribute] = [];
      }
    }

    if ( ! (buttonsCount = itemValues[PluralAttribute.Operations].length)) {
      throw new Error('Operations not found');
    }

    for (let i = 0; i < buttonsCount; i++) {
      const button: Button = new Button;

      for (const [singularAttribute, pluralAttribute] of ConfigItemAttributes.entries()) {
        button[singularAttribute] = itemValues[pluralAttribute][i] ?
          itemValues[pluralAttribute][i] : itemValues[pluralAttribute][0];
      }
      button[SingularAttribute.Alignment] = alignment;
      this.addButtonToTree(button, position);
    }

  }

  parseConfig() {
    const defaultConfig: { [key: number]: ConfigItem; } = config['default'];

    for (const configItem of Object.values(defaultConfig)) {
      this.parseConfigItem(configItem);
    }
  }
}
