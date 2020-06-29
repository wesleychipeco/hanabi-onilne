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
      playerOrderIndex: null,
      localizedPlayersList: [],
      myPlayer: {},
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
      const playerName = shuffledPlayers[i];
      const hand = shuffledCards.splice(0, cardsPerPlayer);

      const playerObject = {
        playerName,
        playerLetter,
        hand,
      };
      playersList.push(playerObject);
      playersOrderList.push(playerLetter);

      if (playerName === this.props.playerName) {
        this.setState({
          playerOrderIndex: i,
          myPlayer: playerObject,
        });
      }
    }
    return { playersList, playersOrderList };
  };

  getLocalizedPlayersList = (playersList) => {
    const localizedPlayersList = [...playersList];
    const tail = localizedPlayersList.slice(this.state.playerOrderIndex + 1);
    const wrappedFromStart = localizedPlayersList.slice(
      0,
      this.state.playerOrderIndex
    );
    return [...tail, ...wrappedFromStart];
  };

  // Shuffle deck
  // Set player order
  // Deal cards to each player
  startGameActions = async () => {
    const { gameCode } = this.props;
    const gameObjectArray = await findMongo(this.gamesCollection, { gameCode });
    if (gameObjectArray.length === 1) {
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
      console.log("pl", playersList);

      const localizedPlayersList = this.getLocalizedPlayersList(playersList);
      console.log("local", localizedPlayersList);
      this.setState({
        localizedPlayersList,
      });

      this.gamesCollection.updateOne(
        { gameCode },
        {
          $set: {
            turnNumber: 0,
            turnLetter: null,
            playersList,
            playersOrderList,
            mistakesMade: 0,
            cluesRemaining: 8,
            deckCards: shuffledCards,
            playedCards: [],
            discardedCards: [],
          },
        }
      );
    }
  };

  render() {
    console.log("render", this.state);
    const { localizedPlayersList } = this.state;

    if (localizedPlayersList.length === 0) {
      return null;
    }

    return (
      <div>
        <div>
          <h3>Game Board</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {localizedPlayersList.map((player) => {
              return (
                <div key={player.playerLetter}>
                  <p>{player.playerName}</p>
                  {player.hand.map((card) => (
                    <p key={`${card.cardName}-${card.keyCopy}`}>
                      {card.cardName}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
          <div>
            <p>My cards</p>
            {this.state.myPlayer.hand.map((card) => (
              <p key={`${card.cardName}-${card.keyCopy}`}>{card.cardName}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode, getPlayerName } = getGameStateSelectors(state);

  const hardcodedPlayersList = ["host", "player1", "player2", "player3"];
  const randomInteger = Math.floor(Math.random() * Math.floor(5));

  return {
    gameCode: "F6A8",
    playerName: hardcodedPlayersList[randomInteger],
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(GameBoard);
