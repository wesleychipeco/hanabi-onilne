import { createAction } from "@reduxjs/toolkit";
import { SELECT_CARD } from "./cardsActionTypes";

const selectCard = createAction(SELECT_CARD);

export { selectCard };
