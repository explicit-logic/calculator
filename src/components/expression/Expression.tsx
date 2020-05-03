import * as React from 'react';
import { useCalculator } from '../context/CalculatorContext';

import { Block } from '../Block';
// import BlockModel from '../../models/blocks/BaseBlock';

export default function Expression() {
  const { state } = useCalculator();
  return (
    <div className="wrapper expression">
      {
        state.expression.map((blockModel) => (<Block key={blockModel.id} model={blockModel} />))
      }
    </div>
  );
}
