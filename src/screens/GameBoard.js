import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { getGameStateSelectors } from "../store/gameReducer";
import { returnMongoCollection, findMongo } from "../utils/databaseManagement";

const CARDS_PER_PLAYER = [null, null, 5, 5, 4, 4];
const playerLetterArray = ["A", "B", "C", "D", "E"];

class GameBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.gamesCollection = returnMongoCollection("games");
    this.decksCollection = returnMongoCollection("decks");

    this.state = {
      playersList: [],
    };
  }

  async componentDidMount() {
    await this.startListening();

    await this.startGameActions();

    // set player

    // shuffle deck
  }

  startListening = async () => {
    const { gameCode } = this.props;
    const watchedCollection = await this.gamesCollection.watch();
    watchedCollection.onNext(async (changeEvent) => {
      console.log("NEW UPDATE", changeEvent);
      if (
        changeEvent?.operationType === "update" &&
        changeEvent?.fullDocument?.gameCode === gameCode
      ) {
        const { fullDocument } = changeEvent;

        console.log("NEW FULL DOC", fullDocument);
      }
    });
  };

  shuffleArray = (startingDeck) => {
    const cards = [...startingDeck];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return cards;
  };

  dealCardsAndAssignPlayerValues = (shuffledCards, shuffledPlayers) => {
    const playersList = [];
    const playersOrderList = [];
    const numberOfPlayers = shuffledPlayers.length;
    const cardsPerPlayer = CARDS_PER_PLAYER[numberOfPlayers];

    for (let i = 0; i < shuffledPlayers.length; i++) {
      const playerLetter = playerLetterArray[i];
      const hand = shuffledCards.splice(0, cardsPerPlayer);

      const playerObject = {
        playerName: shuffledPlayers[i],
        playerLetter,
        hand,
      };
      playersList.push(playerObject);
      playersOrderList.push(playerLetter);
    }
    return { playersList, playersOrderList };
  };

  // Shuffle deck
  // Set player order
  // Deal cards to each player
  startGameActions = async () => {
    const { gameCode } = this.props;
    const gameObjectArray = await findMongo(this.gamesCollection, { gameCode });
    if (gameObjectArray.length === 1) {
      // console.log("game object array", gameObjectArray);
      const gameObject = gameObjectArray[0];
      // get decks
      const { deckName, playerNames, hostName } = gameObject;
      const decksObjectArray = await findMongo(this.decksCollection, {
        deckName,
      });
      const { cards } = decksObjectArray[0];

      // SHUFFLE DECK
      const shuffledCards = this.shuffleArray(cards);

      // SHUFFLE PLAYERS
      playerNames.push(hostName);
      const shuffledPlayers = this.shuffleArray(playerNames);

      const {
        playersList,
        playersOrderList,
      } = this.dealCardsAndAssignPlayerValues(shuffledCards, shuffledPlayers);

      this.setState({
        playersList,
        playersOrderList,
      });
    }
  };

  render() {
    console.log("render", this.state.playersList);
    return (
      <div>
        <h3>Game Board</h3>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode, getPlayerName } = getGameStateSelectors(state);

  return {
    gameCode: "F6A8",
    playerName: getPlayerName(),
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(GameBoard);
