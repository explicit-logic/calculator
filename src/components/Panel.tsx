import * as React from "react";

import {Button as ButtonModel} from '../models/Button';
import {Button} from './Button';
import {Direction} from './../models/Direction';

import {Position} from './../models/Position';

export interface PanelProps {
  position: Position;
  alignmentButtons: {[key: string]: ButtonModel[]};
}

const PositionDirection = new Map<Position, Direction>([
  [Position.Top, Direction.Horizontal],
  [Position.Left, Direction.Vertical],
  [Position.Right, Direction.Vertical],
  [Position.Bottom, Direction.Horizontal],
]);

export const Panel = (props: PanelProps) => {
  const alignmentButtons = props.alignmentButtons;
  const direction = PositionDirection.get(props.position);

  let alignmentKeys = alignmentButtons ? Object.keys(alignmentButtons) : [];
  const alignmentCount = alignmentKeys.length;

  return (
    <div className={`tools ${props.position}-panel`}>
      {
        alignmentKeys.map(alignment => {
          let alignmentClass: string = 'buttons';
          const buttonModels = alignmentButtons[alignment];

          if (alignmentCount > 1) {
            alignmentClass = `buttons-${alignment}`;
          }

          return (
          <div key={alignment} className={direction + " " + alignmentClass}>
            {
              buttonModels.map((buttonModel) => {
                return <Button key={buttonModel.id} model={buttonModel} />
              })
            }
          </div>
          );
        })
      }
    </div>
    );
}


