import * as React from 'react';

import { Button } from '../Button';
import { Button as ButtonModel } from '../../models/Button';

export interface ButtonsProps {
  className: string;
  buttonModels: ButtonModel[];
}

export const Buttons: React.FunctionComponent<ButtonsProps> = (props: ButtonsProps) => {
  const { className, buttonModels } = props;
  return (
    <div className={className}>
      {
        buttonModels.map((buttonModel) => (<Button key={buttonModel.id} model={buttonModel} />))
      }
    </div>
  );
};
