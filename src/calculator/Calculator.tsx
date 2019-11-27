import * as React from "react";

import {Panel, Position} from './../panel/Panel';
import {Scene} from './../scene/Scene';

export class Calculator extends React.Component {

  render() {
      return (
      <div className="wrapper">
      {
        Object
          .keys(Position)
          .map(key => (<Panel key={key} position={Position[key]} />))
      }
      <Scene />
      </div>
      );
  }
}
