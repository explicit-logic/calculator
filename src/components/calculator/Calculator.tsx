import * as React from "react";

import { ExpressionHandler } from '../expression/ExpressionHandler';
import { BaseBlock } from '../../models/blocks/BaseBlock';

import { Panel } from './../Panel';
import { Scene } from './../Scene';

import { Position } from './../../models/Position';

import { ButtonsFactory } from '../buttons/ButtonsFactory';

export const Calculator: React.FC = () => {
  const buttonsFactory = new ButtonsFactory;
  buttonsFactory.init();

  const [expression, setExpression] = React.useState<BaseBlock[]>([]);

  return (
    <div className="wrapper">
      {
        Object
          .keys(Position)
          .map(key => (<Panel
            key={key}
            position={Position[key]}
            alignmentButtons={buttonsFactory.getButtonsByPosition(Position[key])}
          />))
      }
      <Scene expression={expression} />
    </div>
  );
}
