import * as React from 'react';
// import { ResultHandler, ResultState } from '../../handlers/ResultHandler';
// import CalculatorService from '../../services/CalculatorService';
import ExpressionHandler from '../expression/ExpressionHandler';
import BaseBlock from '../../models/blocks/BaseBlock';
import { Panel } from '../Panel';
import { Scene } from '../Scene';

import Position from '../../models/Position';

import ButtonConfigSerializer from '../../serializers/ButtonsConfigSerializer';

const Calculator: React.FunctionComponent = () => {
  const expressionHandler = new ExpressionHandler(...React.useState<BaseBlock[]>([]));
  // const resultHandler = new ResultHandler(...React.useState<ResultState>({
  //   value: 0,
  //   showResult: false,
  // }));
  // const calculatorService = new CalculatorService(expressionHandler, resultHandler);
  const buttonCollection = ButtonConfigSerializer.getCollection();

  return (
    <div className="wrapper">
      {
        Object
          .keys(Position)
          .map((key) => (
            <Panel
              key={key}
              position={Position[key]}
              alignmentButtons={buttonCollection.getByPosition(Position[key])}
            />
          ))
      }
      <Scene expression={expressionHandler.expression} />
    </div>
  );
};

export { Calculator as default };
