import * as React from "react";
import {Buttons, Direction} from './Buttons';
import {ButtonsProvider} from './../libs/ButtonsProvider';

export enum Position {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom'
}

export interface PanelProps {
  position: Position;
  buttonsProvider: ButtonsProvider;
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
        items={this.props.buttonsProvider.getButtonsByPosition(this.props.position)}
        />
    </div>
    );
  }
}
