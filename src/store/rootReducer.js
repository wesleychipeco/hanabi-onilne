import gameReducer, { GAME_STATE_PATH } from "./gameReducer";
import cardsReducer, { CARDS_STATE_PATH } from "./cardsReducer";

export default {
  [GAME_STATE_PATH]: gameReducer,
  [CARDS_STATE_PATH]: cardsReducer,
};
