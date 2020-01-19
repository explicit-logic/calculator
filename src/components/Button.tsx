import * as React from "react";

import {Button as ButtonModel} from '../models/Button';

export interface ButtonProps {
  model: ButtonModel;
};

export const Button = (props: ButtonProps) => {

  return (<a
    href="#"
    className={props.model.className || 'button round gray'}
    onClick={()=>{alert('clk')}}
  >{props.model.label}</a>);
}
