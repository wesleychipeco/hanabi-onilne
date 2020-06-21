import { getStateSlice } from "./reduxUtils";
import {
  SET_GAME_CODE,
  SET_DECK_NAME,
  SET_PLAYER_NAME,
  SET_PLAYER_NUMBER,
} from "./gameActionTypes";

const GAME_STATE_PATH = "game";

const initialState = {
  gameCode: "",
  deckName: "",
  playerName: "",
  playerNumber: undefined,
};

const gameReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_GAME_CODE:
      return {
        ...state,
        gameCode: payload,
      };

    case SET_DECK_NAME:
      return {
        ...state,
        deckName: payload,
      };

    case SET_PLAYER_NAME:
      return {
        ...state,
        playerName: payload,
      };

    case SET_PLAYER_NUMBER:
      return {
        ...state,
        playerNumber: payload,
      };

    default:
      return state;
  }
};

const getGameStateSelectors = (rootState) => {
  const state = getStateSlice(rootState, GAME_STATE_PATH);

  return {
    getGameCode: () => state.gameCode,
    getDeckName: () => state.deckName,p
    getPlayerName: () => state.playerName,
    getPlayerNumber: () => state.playerNumber,
  };
};

export { GAME_STATE_PATH, getGameStateSelectors };

export default gameReducer;
