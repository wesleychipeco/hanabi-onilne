import { createAction } from "@reduxjs/toolkit";
import {
  SET_GAME_CODE,
  SET_DECK_NAME,
  SET_PLAYER_NAME,
  SET_PLAYER_NUMBER,
} from "./gameActionTypes";

const setGameCode = createAction(SET_GAME_CODE);
const setDeckName = createAction(SET_DECK_NAME);
const setPlayerName = createAction(SET_PLAYER_NAME);
const setPlayerNumber = createAction(SET_PLAYER_NUMBER);

export { setGameCode, setDeckName, setPlayerName, setPlayerNumber };
