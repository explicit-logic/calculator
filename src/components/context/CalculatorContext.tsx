import React, { createContext, useContext, useReducer } from 'react';
import { calculatorType, calculatorState, calculatorReducer } from '../../reducers/calculator';
import CalculatorService from '../../services/CalculatorService';

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

const calculatorDispatch = (
  dispatch: React.Dispatch<any>,
) => (action: any) => (
  Array.isArray(action)
    ? action.filter(Boolean).map(dispatch)
    : dispatch(action)
);

const useCalculatorService = (state: calculatorType) => (new CalculatorService(state));

export const CalculatorContextProvider: React.FunctionComponent<CalculatorContextProps> = (
  { children }: CalculatorContextProps,
) => {
  const [state, dispatch] = useReducer(calculatorReducer, calculatorState);

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch: calculatorDispatch(dispatch),
        calculatorService: useCalculatorService(state),
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => useContext(CalculatorContext);
