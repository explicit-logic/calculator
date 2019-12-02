import * as React from "react";

import {BaseBlock} from '../models/BaseBlock';

export interface ExpressionState {
  expression: BaseBlock[];
  lastBlockId: number;
}
export class Expression extends React.Component<{}, ExpressionState> {


  render() {
    return <div className="wrapper expression"></div>;
  }
}
