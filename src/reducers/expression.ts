import BaseBlock from '../models/blocks/BaseBlock';

export type expressionType = {
  bracketCount: number;
  blocks: BaseBlock[];
};

export const expressionState: expressionType = {
  bracketCount: 0,
  blocks: [],
};

export function expressionReducer(state = expressionState, action) {
  switch (action.type) {
    case 'addBlock':
      return {
        ...state,
        blocks: [
          ...state.blocks,
          action.block,
        ],
      };
    case 'updateBlock':
      return {
        ...state,
        blocks: [
          ...state.blocks,
        ],
      };
    case 'replaceBlock':
      return {
        ...state,
        blocks: state.blocks.map((block) => (
          (block.id === action.searchBlock.id)
            ? action.replaceBlock
            : block
        )),
      };
    case 'removeBracket':
      return {
        ...state,
        bracketCount: action.block.value === ')'
          ? state.bracketCount + 1
          : state.bracketCount - 1,
        blocks: state.blocks.filter((block) => block.id !== action.block.id),
      };
    case 'removeBlock':
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.block.id),
      };
    case 'addOpenBracket':
      return {
        ...state,
        bracketCount: state.bracketCount + 1,
        blocks: [
          ...state.blocks,
          action.block,
        ],
      };
    case 'addCloseBracket':
      return {
        ...state,
        bracketCount: state.bracketCount - 1,
        blocks: [
          ...state.blocks,
          action.block,
        ],
      };
    case 'clear':
      return {
        bracketCount: 0,
        blocks: [],
      };
    default:
      return state;
  }
}
