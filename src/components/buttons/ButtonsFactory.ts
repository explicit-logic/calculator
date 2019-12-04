import * as config from './buttonsConfig.json';

import {Position} from './../../models/Position';

type ObjectArray = object[];

type StringOrTwoStrings = string | [string, string];

export class ButtonsFactory {
  buttonsTree: object;

  addItemToTree(item: object) {
    const position: Position = Array.isArray(item['position']) ? item['position'][0] : item['position'];

    if (!Array.isArray(this.buttonsTree[position])) {
      this.buttonsTree[position] = [];
    }

    this.buttonsTree[position].push(item);
  }

  getButtonsByPosition(position: Position): ObjectArray {
    return this.buttonsTree[position];
  }

  init() {
    this.parseConfig();
  }

  parseConfig() {
    for(let configItem of config){
      this.addItemToTree(configItem);
    }
  }
}
