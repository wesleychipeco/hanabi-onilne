import { createAction } from "@reduxjs/toolkit";
import {
  SET_GAME_CODE,
  SET_DECK_NAME,
  SET_HOST_NAME,
  SET_PLAYER_NAME,
  SET_PLAYER_NUMBER,
} from "./gameActionTypes";

const setGameCode = createAction(SET_GAME_CODE);
const setDeckName = createAction(SET_DECK_NAME);
const setHostName = createAction(SET_HOST_NAME);
const setPlayerName = createAction(SET_PLAYER_NAME);
const setPlayerNumber = createAction(SET_PLAYER_NUMBER);

export {
  setGameCode,
  setDeckName,
  setHostName,
  setPlayerName,
  setPlayerNumber,
};
