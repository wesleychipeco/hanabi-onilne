import { createAction } from "@reduxjs/toolkit";
import {
  SET_GAME_CODE,
  SET_PLAYER_NAME,
  SET_PLAYER_NUMBER,
} from "./gameActionTypes";

const setGameCode = createAction(SET_GAME_CODE);
const setPlayerName = createAction(SET_PLAYER_NAME);
const setPlayerNumber = createAction(SET_PLAYER_NUMBER);

export { setGameCode, setPlayerName, setPlayerNumber };
