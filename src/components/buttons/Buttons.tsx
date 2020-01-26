import * as React from "react";

import { Button } from '../Button';
import { Button as ButtonModel } from '../../models/Button';

export interface ButtonsProps {
  className: string;
  buttonModels: ButtonModel[];
};

export const Buttons = (props: ButtonsProps) => {

  return (
    <div className={props.className}>
      {
        props.buttonModels.map((buttonModel) => {
          return <Button key={buttonModel.id} model={buttonModel} />
        })
      }
    </div>
  );
}
