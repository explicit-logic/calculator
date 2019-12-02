import * as React from "react";

import * as config from './../../config';

import {Panel, Position} from './../Panel';
import {Scene} from './../Scene';

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
