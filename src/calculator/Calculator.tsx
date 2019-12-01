import * as React from "react";

import * as config from './../config';

import {Panel, Position} from './../panel/Panel';
import {Scene} from './../scene/Scene';

export class Calculator extends React.Component {

  render() {
      return (
      <div className="wrapper">
      {
        Object
          .keys(Position)
          .map(key => (<Panel key={key} position={Position[key]} config={config}/>))
      }
      <Scene />
      </div>
      );
  }
}
