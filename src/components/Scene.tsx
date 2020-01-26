import * as React from "react";

import { BaseBlock } from '../models/blocks/BaseBlock';
import { Expression } from './expression/Expression';
import { Result } from './Result';

export interface SceneProps { expression: BaseBlock[] };

export const Scene = (props: SceneProps) => {
  return (
    <div className="expression-scene">
      <Expression expression={props.expression} />
      <Result />
    </div>
  );
}
