import {
  Button,
} from '../models/Button';
import { hasOwnProperty } from '../common/utils';

import Position from '../models/Position';
import { ButtonConstituents } from '../models/ButtonConstituents';

export default class ButtonCollection {
  #tree: { [key: string]: {[key: string]: Button[]} };

  constructor() {
    this.#tree = {};
  }

  add(
    button: Button,
    position: Position = Position.Top,
  ): void {
    if (!hasOwnProperty(this.#tree, position)) {
      this.#tree[position] = {};
    }

    if (!hasOwnProperty(this.#tree[position], button.alignment)) {
      this.#tree[position][button.alignment] = [];
    }

    this.#tree[position][button.alignment].push(button);
  }

  getByPosition(position: Position): {[key: string]: Button[]} {
    return this.#tree[position];
  }

  addFromConstituents(buttonConstituents: ButtonConstituents): ButtonCollection {
    for (const buttonConstituent of buttonConstituents) {
      const button = new Button();
      button.action = buttonConstituent.action;
      button.alignment = buttonConstituent.alignment;
      button.className = buttonConstituent.className;
      button.key = buttonConstituent.key;
      button.label = buttonConstituent.label;
      button.operation = buttonConstituent.operation;
      this.add(button, buttonConstituent.position);
    }
    return this;
  }
}
