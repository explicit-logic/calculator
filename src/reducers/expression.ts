import BaseBlock from '../models/blocks/BaseBlock';

export type expressionType = BaseBlock[];

export const expressionState: expressionType = [];

export function expressionReducer(state = expressionState, action) {
  switch (action.type) {
    case 'addBlock':
      return [
        ...state,
        action.block,
      ];
    default:
      return state;
  }
}
