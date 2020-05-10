import * as React from 'react';
import { Button as ButtonModel } from '../models/Button';
import { useCalculator } from './context/CalculatorContext';

export interface ButtonProps {
  model: ButtonModel;
}

export const Button: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { model } = props;
  const { dispatch, calculatorService } = useCalculator();

  return (
    <button
      type="button"
      className={model.className || 'button round gray'}
      onClick={(): void => {
        dispatch(calculatorService.runAction(model.action, model.operation));
      }}
    >
      {model.label}
    </button>
  );
};
