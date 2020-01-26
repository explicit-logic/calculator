import * as React from "react";

import { Block } from '../Block';
import { BaseBlock as BlockModel } from '../../models/blocks/BaseBlock';

export interface ExpressionProps { expression: BlockModel[] };

export const Expression = (props: ExpressionProps) => {
  return (
    <div className="wrapper expression">
      {
        props.expression.map(blockModel => {
          return (<Block key={blockModel.id} model={blockModel}/>);
        })
      }
    </div>
  );
}
