import gameReducer, { GAME_STATE_PATH } from "./gameReducer";

export default {
  [GAME_STATE_PATH]: gameReducer,
};
