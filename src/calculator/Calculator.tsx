import * as React from "react";

import {Panel, Position} from './../panel/Panel';

export class Calculator extends React.Component {

  render() {
      return (
      <>
      {
        Object
          .keys(Position)
          .map(key => (<Panel key={key} position={Position[key]} />))
      }
      </>
      );
  }
}
