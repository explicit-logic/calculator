import * as React from "react";

import * as config from './../config/buttons.json';

import {Panel, Position} from './../panel/Panel';
import {Scene} from './../scene/Scene';

console.log(config);
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
