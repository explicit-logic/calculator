import * as React from "react";
import {Buttons} from './buttons';

import {Position} from './../models/Position';
import {Direction} from './../models/Direction';

import {ButtonsFactory} from './buttons/ButtonsFactory';

export interface PanelProps {
  position: Position;
  buttonsFactory: ButtonsFactory;
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
      <Buttons
        direction={PositionDirection.get(this.props.position)}
        items={this.props.buttonsFactory.getButtonsByPosition(this.props.position)}
        />
    </div>
    );
  }
}
