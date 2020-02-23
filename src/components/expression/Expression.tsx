import * as React from 'react';

import { Block } from '../Block';
import BlockModel from '../../models/blocks/BaseBlock';

export interface ExpressionProps { expression: BlockModel[] }

export const Expression: React.FunctionComponent<ExpressionProps> = (props: ExpressionProps) => {
  const { expression } = props;
  return (
    <div className="wrapper expression">
      {
        expression.map((blockModel) => (<Block key={blockModel.id} model={blockModel} />))
      }
    </div>
  );
};
