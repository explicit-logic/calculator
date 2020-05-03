
export type resultType = {
  value: number;
  showResult: boolean;
};

export const resultState: resultType = {
  value: 0,
  showResult: false,
};

export function resultReducer(state = resultState, action) {
  switch (action.type) {
    case 'setResult':
      return {
        ...state,
        value: action.value,
      };
    case 'showResult':
      return {
        ...state,
        showResult: action.showResult,
      };
    default:
      return state;
  }
}
