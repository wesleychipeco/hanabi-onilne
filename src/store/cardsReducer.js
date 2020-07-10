import { getStateSlice } from "./reduxUtils";
import { SELECT_CARD } from "./cardsActionTypes";

const CARDS_STATE_PATH = "cards";

const initialState = {
  selectedCard: "",
};

const cardsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_CARD:
      return {
        ...state,
        selectedCard: payload,
      };
    default:
      return state;
  }
};

const getCardsStateSelectors = (rootState) => {
  const state = getStateSlice(rootState, CARDS_STATE_PATH);

  return {
    getSelectedCard: () => state.selectedCard,
  };
};

export { CARDS_STATE_PATH, getCardsStateSelectors };

export default cardsReducer;
