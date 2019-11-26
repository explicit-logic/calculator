import * as React from "react";

export enum Position {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom'
}

export interface PanelProps {
  position: Position;
}

export class Panel extends React.Component<PanelProps, {}> {
  render() {
    return <div className={"tools "+this.props.position}></div>;
  }
}
