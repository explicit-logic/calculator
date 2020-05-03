import React, { createContext, useContext, useReducer } from 'react';
import { calculatorType, calculatorState, calculatorReducer } from '../../reducers/calculator';
import CalculatorService from '../../services/CalculatorService';
import ExpressionHandler from '../../handlers/ExpressionHandler';
import { ResultHandler } from '../../handlers/ResultHandler';

export interface CalculatorContextProps {
  children: React.ReactNode;
}

export const CalculatorContext = createContext<{
  state: calculatorType;
  dispatch: React.Dispatch<any>;
  calculatorService: CalculatorService | null;
}>({
  state: calculatorState,
  dispatch: () => null,
  calculatorService: null,
});

// export const CalculatorContext = createContext({});

export const CalculatorContextProvider: React.FunctionComponent<CalculatorContextProps> = (
  { children }: CalculatorContextProps,
) => {
  const [state, dispatch] = useReducer(calculatorReducer, calculatorState);

  const expressionHandler = new ExpressionHandler(state.expression);
  const resultHandler = new ResultHandler(state.result);
  const calculatorService = new CalculatorService(expressionHandler, resultHandler);

  return (
    <CalculatorContext.Provider value={{ state, dispatch, calculatorService }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => useContext(CalculatorContext);
