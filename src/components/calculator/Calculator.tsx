import * as React from "react";

import * as config from './../../config';

import {Panel, Position} from './../Panel';
import {Scene} from './../Scene';

import {ButtonsProvider} from './../../libs/ButtonsProvider';

export class Calculator extends React.Component {

  buttonsProvider: ButtonsProvider;

  constructor(props) {
    super(props);

    let buttonsProvider = new ButtonsProvider;
    buttonsProvider.loadConfig(config.buttons);
    this.buttonsProvider = buttonsProvider;
  }

  render() {
      return (
      <div className="wrapper">
      {
        Object
          .keys(Position)
          .map(key => (<Panel key={key} position={Position[key]} buttonsProvider={this.buttonsProvider}/>))
      }
      <Scene />
      </div>
      );
  }
}
