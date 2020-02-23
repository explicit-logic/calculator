import * as React from 'react';
import { Button as ButtonModel } from '../models/Button';

export interface ButtonProps {
  model: ButtonModel;
}

export const Button: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { model } = props;
  return (
    <button
      type="button"
      className={model.className || 'button round gray'}
      onClick={(): void => {
        model.doAction();
      }}
    >
      {model.label}
    </button>
  );
};
