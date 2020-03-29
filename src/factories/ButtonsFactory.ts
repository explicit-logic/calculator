import config from '../config/buttons.json';
import { hasOwnProperty } from '../common/utils';

import Alignment from '../models/Alignment';
import { SingularAttribute, PluralAttribute } from '../models/ButtonConstituents';

import Position from '../models/Position';

import {
  ActionType,
  Button,
  OperationType,
  KeyType,
} from '../models/Button';

const ConfigItemAttributes = new Map<SingularAttribute, PluralAttribute>([
  [SingularAttribute.Operation, PluralAttribute.Operations],
  [SingularAttribute.Action, PluralAttribute.Actions],
  [SingularAttribute.Key, PluralAttribute.Keys],
  [SingularAttribute.Label, PluralAttribute.Labels],
  [SingularAttribute.ClassName, PluralAttribute.ClassNames],
]);

type ConfigPositionType = Position | [Position, Alignment];

interface RequiredSingularConfigItem {
  [SingularAttribute.Operation]: OperationType;
}

interface RequiredPluralConfigItem {
  [PluralAttribute.Operations]: OperationType[];
}

interface OptionalSingularConfigItem {
  [SingularAttribute.Position]?: ConfigPositionType;
  [SingularAttribute.Action]?: ActionType;
  [SingularAttribute.Key]?: KeyType;
  [SingularAttribute.Label]?: string;
}

interface OptionalPluralConfigItem {
  [PluralAttribute.Actions]?: ActionType[];
  [PluralAttribute.Keys]?: KeyType[];
  [PluralAttribute.Labels]?: string[];
}

type ConfigItem = OptionalSingularConfigItem & OptionalPluralConfigItem &
  (RequiredSingularConfigItem | RequiredPluralConfigItem);

export default class ButtonsFactory {
  buttonsTree: { [key: string]: {[key: string]: Button[]} };

  constructor() {
    this.buttonsTree = {};
  }

  addButtonToTree(
    button: Button,
    position: Position = Position.Top,
  ): void {
    if (!hasOwnProperty(this.buttonsTree, position)) {
      this.buttonsTree[position] = {};
    }

    if (!hasOwnProperty(this.buttonsTree[position], button.alignment)) {
      this.buttonsTree[position][button.alignment] = [];
    }

    this.buttonsTree[position][button.alignment].push(button);
  }

  getButtonsByPosition(position: Position): {[key: string]: Button[]} {
    return this.buttonsTree[position];
  }

  init(): void {
    this.parseConfig();
  }

  parseConfigItem(item: ConfigItem): void {
    let positionValue: ConfigPositionType;
    let alignment: Alignment = Alignment.Left;
    let position: Position = Position.Top;
    let buttonsCount = 0;

    const itemValues: object = {};

    if (hasOwnProperty(item, SingularAttribute.Position)) {
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
      if (hasOwnProperty(item, singularAttribute)) {
        itemValues[pluralAttribute] = [item[singularAttribute]];
      } else if (hasOwnProperty(item, pluralAttribute)) {
        itemValues[pluralAttribute] = item[pluralAttribute];
      } else {
        itemValues[pluralAttribute] = [];
      }
    }

    buttonsCount = itemValues[PluralAttribute.Operations].length;
    if (!buttonsCount) {
      throw new Error('Operations not found');
    }

    for (let i = 0; i < buttonsCount; i += 1) {
      const button: Button = new Button();

      for (const [singularAttribute, pluralAttribute] of ConfigItemAttributes.entries()) {
        button[singularAttribute] = itemValues[pluralAttribute][i]
          ? itemValues[pluralAttribute][i] : itemValues[pluralAttribute][0];
      }
      button[SingularAttribute.Alignment] = alignment;
      this.addButtonToTree(button, position);
    }
  }

  parseConfig(): void {
    for (const configItem of Object.values<ConfigItem>(config as ConfigItem[])) {
      this.parseConfigItem(configItem);
    }
  }
}
