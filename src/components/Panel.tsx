import * as React from 'react';

import { Button as ButtonModel } from '../models/Button';
import { Buttons } from './buttons';
import Direction from '../models/Direction';

import Position from '../models/Position';

export interface PanelProps {
  position: Position;
  alignmentButtons: { [key: string]: ButtonModel[] };
}

const PositionDirection = new Map<Position, Direction>([
  [Position.Top, Direction.Horizontal],
  [Position.Left, Direction.Vertical],
  [Position.Right, Direction.Vertical],
  [Position.Bottom, Direction.Horizontal],
]);

export const Panel: React.FunctionComponent<PanelProps> = (props: PanelProps) => {
  const { alignmentButtons, position } = props;
  const direction = PositionDirection.get(position);

  const alignmentKeys = alignmentButtons ? Object.keys(alignmentButtons) : [];
  const alignmentCount = alignmentKeys.length;

  return (
    <div className={`tools ${position}-panel`}>
      {
        alignmentKeys.map((alignment) => {
          let alignmentClass = 'buttons';
          const buttonModels = alignmentButtons[alignment];

          if (alignmentCount > 1) {
            alignmentClass = `buttons-${alignment}`;
          }

          return (
            <Buttons key={alignment} className={`${direction} ${alignmentClass}`} buttonModels={buttonModels} />
          );
        })
      }
    </div>
  );
};
