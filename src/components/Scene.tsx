import * as React from 'react';

import BaseBlock from '../models/blocks/BaseBlock';
import { Expression } from './expression/Expression';
import Result from './result/Result';

export interface SceneProps { expression: BaseBlock[] }

export const Scene: React.FunctionComponent<SceneProps> = (props: SceneProps) => {
  const { expression } = props;
  return (
    <div className="expression-scene">
      <Expression expression={expression} />
      <Result />
    </div>
  );
};
