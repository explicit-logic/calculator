import * as React from "react";

export enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface ButtonsProps {
  direction: Direction;
  items: object[];
};

export const Buttons = (props: ButtonsProps) => {
  return (<div className={props.direction+" buttons"}></div>);
}
