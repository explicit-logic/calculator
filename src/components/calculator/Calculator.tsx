import * as React from "react";

import {Panel} from './../Panel';
import {Scene} from './../Scene';

import {Position} from './../../models/Position';

import {ButtonsFactory} from '../buttons/ButtonsFactory';

export class Calculator extends React.Component {

  buttonsFactory: ButtonsFactory;

  constructor(props) {
    super(props);

    let buttonsFactory = new ButtonsFactory;
    buttonsFactory.init();

    this.buttonsFactory = buttonsFactory;
  }

  render() {
      return (
      <div className="wrapper">
      {
        Object
          .keys(Position)
          .map(key => (<Panel key={key} position={Position[key]} buttonsFactory={this.buttonsFactory}/>))
      }
      <Scene />
      </div>
      );
  }
}
