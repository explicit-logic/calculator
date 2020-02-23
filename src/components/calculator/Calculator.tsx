import * as React from 'react';

import CalculatorAction from './CalculatorAction';
import ExpressionHandler from '../expression/ExpressionHandler';
import BaseBlock from '../../models/blocks/BaseBlock';

import { ResultState } from '../result/ResultState';
import ResultHandler from '../result/ResultHandler';

import { Panel } from '../Panel';
import { Scene } from '../Scene';

import Position from '../../models/Position';

import ButtonsFactory from '../buttons/ButtonsFactory';

const Calculator: React.FunctionComponent = () => {
  const expressionHandler = new ExpressionHandler(...React.useState<BaseBlock[]>([]));
  const resultHandler = new ResultHandler(...React.useState<ResultState>({
    value: 0,
    showResult: false,
  }));
  const calculatorAction = new CalculatorAction(expressionHandler, resultHandler);
  const buttonsFactory = new ButtonsFactory(calculatorAction);

  buttonsFactory.init();

  return (
    <div className="wrapper">
      {
        Object
          .keys(Position)
          .map((key) => (
            <Panel
              key={key}
              position={Position[key]}
              alignmentButtons={buttonsFactory.getButtonsByPosition(Position[key])}
            />
          ))
      }
      <Scene expression={expressionHandler.expression} />
    </div>
  );
};

export { Calculator as default };
