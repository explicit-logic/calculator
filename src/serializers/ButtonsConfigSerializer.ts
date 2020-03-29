import config from '../config/buttons.json';
import { hasOwnProperty } from '../common/utils';

import Alignment from '../models/Alignment';
import { SingularAttribute, PluralAttribute, ButtonConstituents } from '../models/ButtonConstituents';

import Position from '../models/Position';

import {
  ActionType,
  OperationType,
  KeyType,
} from '../models/Button';

import ButtonCollection from '../collections/ButtonCollection';

const ConfigPluralAttributesMap = new Map<SingularAttribute, PluralAttribute>([
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

export default class ButtonsConfigSerializer {
  static toButtonConstituents(item: ConfigItem): ButtonConstituents {
    const buttonConstituents = new ButtonConstituents();

    if (hasOwnProperty(item, SingularAttribute.Position)) {
      const positionValue = item[SingularAttribute.Position];

      if (Array.isArray(positionValue)) {
        [buttonConstituents.position, buttonConstituents.alignment] = positionValue;
      } else {
        buttonConstituents.position = positionValue;
      }
    }

    for (const [singularAttribute, pluralAttribute] of ConfigPluralAttributesMap.entries()) {
      if (hasOwnProperty(item, singularAttribute)) {
        buttonConstituents[pluralAttribute] = [item[singularAttribute]];
      } else if (hasOwnProperty(item, pluralAttribute)) {
        buttonConstituents[pluralAttribute] = item[pluralAttribute];
      }
    }

    return buttonConstituents;
  }

  static getCollection(): ButtonCollection {
    const buttonCollection = new ButtonCollection();

    for (const configItem of Object.values<ConfigItem>(config as ConfigItem[])) {
      const buttonConstituents = ButtonsConfigSerializer.toButtonConstituents(configItem);
      buttonCollection.addFromConstituents(buttonConstituents);
    }

    return buttonCollection;
  }
}
