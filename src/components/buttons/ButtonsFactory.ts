import * as config from './buttonsConfig.json';

import Alignment from '../../models/Alignment';
import { ButtonConfigItem, SingularAttribute, PluralAttribute } from '../../models/ButtonConfigItem';
import CalculatorAction from '../calculator/CalculatorAction';

import Position from '../../models/Position';

import {
  ActionType,
  Button,
  OperationType,
  KeyType,
} from '../../models/Button';

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

type PluralConfigItem = RequiredPluralConfigItem & OptionalPluralConfigItem;

export default class ButtonsFactory {
  calculatorAction: CalculatorAction;

  buttonsTree: { [key: string]: {[key: string]: Button[]} };

  constructor(calculatorAction: CalculatorAction) {
    this.calculatorAction = calculatorAction;
    this.buttonsTree = {};
  }

  addButtonToTree(
    button: Button,
    position: Position = Position.Top,
  ): void {
    if (!Object.prototype.hasOwnProperty.call(this.buttonsTree, position)) {
      this.buttonsTree[position] = {};
    }

    if (!Object.prototype.hasOwnProperty.call(this.buttonsTree[position], button.alignment)) {
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
    //  let itemValues: { [key: string]: OperationType[] | Action[] | KeyType[] } = {};

    const buttonConfigItem = new ButtonConfigItem();

    let itemValues: PluralConfigItem;

    if (Object.prototype.hasOwnProperty.call(item, SingularAttribute.Position)) {
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


    for (const [, pluralAttribute] of ConfigItemAttributes.entries()) {
      buttonConfigItem[pluralAttribute] = item[pluralAttribute];
    }

    // ConfigItemAttributes.forEach((singularAttribute, pluralAttribute) => {
    //   console.log(singularAttribute, pluralAttribute);
    //   buttonConfigItem.setProperty(singularAttribute, item[singularAttribute]);
    // });

    console.log(buttonConfigItem);
    return;

    for (const [singularAttribute, pluralAttribute] of ConfigItemAttributes.entries()) {
      if (item.hasOwnProperty(singularAttribute)) {
        const pa = ConfigItemAttributes.get(singularAttribute);
        itemValues[pluralAttribute] = [item[singularAttribute]];
      } else if (item.hasOwnProperty(pluralAttribute)) {
        itemValues[pluralAttribute] = item[pluralAttribute];
      } else {
        itemValues[pluralAttribute] = [];
      }
    }

    if (!(buttonsCount = itemValues[PluralAttribute.Operations].length)) {
      throw new Error('Operations not found');
    }

    for (let i = 0; i < buttonsCount; i++) {
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
    const defaultConfig: { [key: number]: ConfigItem } = config.default;

    for (const configItem of Object.values(defaultConfig)) {
      this.parseConfigItem(configItem);
    }
  }
}
