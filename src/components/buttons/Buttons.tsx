import * as React from "react";

import {Direction} from '../../models/Direction';

export interface ButtonsProps {
  direction: Direction;
  items: object[];
};

export const Buttons = (props: ButtonsProps) => {
  return (<div className={props.direction+" buttons"}></div>);
}
