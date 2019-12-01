import * as React from "react";
import {Buttons, Direction} from './../buttons/Buttons';

export enum Position {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom'
}

export interface PanelProps {
  position: Position;
  config: object
}

const PositionDirection = new Map<Position, Direction>([
  [Position.Top, Direction.Horizontal],
  [Position.Left, Direction.Vertical],
  [Position.Right, Direction.Vertical],
  [Position.Bottom, Direction.Horizontal],
]);

export class Panel extends React.Component<PanelProps, {}> {
  render() {
    return (
    <div className={"tools "+this.props.position}>
      <Buttons direction={PositionDirection.get(this.props.position)}/>
    </div>
    );
  }
}
