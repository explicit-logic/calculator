import * as React from 'react';
import { useCalculator } from '../context/CalculatorContext';

import { Block } from './block/Block';
// import BlockModel from '../../models/blocks/BaseBlock';

export default function Expression() {
  const { state } = useCalculator();
  return (
    <div className="expression-wrapper">
      <div className="expression">
        {
          state.expression.blocks.map(
            (blockModel) => (<Block key={blockModel.id} model={blockModel} />),
          )
        }
      </div>
    </div>
  );
}
