import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { getGameStateSelectors } from "../store/gameReducer";
import { returnMongoCollection, findMongo } from "../utils/databaseManagement";

const CARDS_PER_PLAYER = [null, null, 5, 5, 4, 4];

class GameBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.gamesCollection = returnMongoCollection("games");
    this.decksCollection = returnMongoCollection("decks");

    this.state = {
      playerOrderIndex: null,
      playersList: [],
      localizedPlayersList: [],
      myPlayer: {},
      turnNumber: 0,
      isItMyTurn: false,
      pendingPlayerAction: "",
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
        this.checkForNewTurn(changeEvent);
      }
    });
  };

  checkForNewTurn = (changeEvent) => {
    const { fullDocument } = changeEvent;
    const { turnNumber, playersList } = fullDocument;
    if (this.state.turnNumber + 1 === turnNumber) {
      console.log("new turn");
      if (playersList[0].playerName === this.props.playerName) {
        console.log("Its my turn now!!!!");
        this.setState({ isItMyTurn: true, turnNumber });
      } else {
        console.log("its not my turn..... :(");
        this.setState({ isItMyTurn: false, turnNumber });
        this.checkForPendingPlayerAction(changeEvent);
      }
    } else {
      console.log("NOOOO new turn");
      this.checkForPendingPlayerAction(changeEvent);
    }
  };

  checkForPendingPlayerAction = (changeEvent) => {
    const pendingPlayerAction =
      changeEvent?.updateDescription?.updatedFields?.pendingPlayerAction;
    this.setState({ pendingPlayerAction });
    if (pendingPlayerAction) {
      console.log("****** playerActionupdated");
    } else {
      console.log("****** player action not updated");
    }
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
    const numberOfPlayers = shuffledPlayers.length;
    const cardsPerPlayer = CARDS_PER_PLAYER[numberOfPlayers];

    for (let i = 0; i < shuffledPlayers.length; i++) {
      const playerName = shuffledPlayers[i];
      const hand = shuffledCards.splice(0, cardsPerPlayer);

      const playerObject = {
        playerName,
        hand,
      };
      playersList.push(playerObject);

      if (playerName === this.props.playerName) {
        this.setState({
          playerOrderIndex: i,
          myPlayer: playerObject,
        });
      }
    }
    return { playersList };
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
      /////// UN COMMENT LATER
      // const shuffledPlayers = this.shuffleArray(playerNames);
      const shuffledPlayers = [...playerNames];

      console.log("SHUFFLED PLAYERS", shuffledPlayers);

      const { playersList } = this.dealCardsAndAssignPlayerValues(
        shuffledCards,
        shuffledPlayers
      );
      console.log("playersList", playersList);

      const localizedPlayersList = this.getLocalizedPlayersList(playersList);
      console.log("localizedPlayersList", localizedPlayersList);
      this.setState({
        playersList,
        localizedPlayersList,
      });

      this.gamesCollection.updateOne(
        { gameCode },
        {
          $set: {
            turnNumber: 1,
            playersList,
            mistakesMade: 0,
            cluesRemaining: 8,
            deckCards: shuffledCards,
            playedCards: [],
            discardedCards: [],
            pendingPlayerAction: "",
          },
        }
      );
    }
  };

  giveClue = () => {
    const { gameCode } = this.props;
    this.gamesCollection.updateOne(
      { gameCode },
      {
        $set: {
          pendingPlayerAction: "giving",
        },
        $inc: {
          cluesRemaining: -1,
        },
      }
    );
  };

  playCard = () => {
    const { gameCode } = this.props;
    this.gamesCollection.updateOne(
      { gameCode },
      {
        $set: {
          pendingPlayerAction: "playing",
        },
      }
    );
  };

  discardCard = () => {
    const { gameCode } = this.props;
    this.gamesCollection.updateOne(
      { gameCode },
      {
        $set: {
          pendingPlayerAction: "discarding",
        },
      }
    );
  };

  endTurn = () => {
    console.log("END TURN!!!!!");
    const { isItMyTurn, playersList } = this.state;
    if (isItMyTurn) {
      const newPlayersList = [...playersList];
      newPlayersList.push(newPlayersList.shift());
      console.log("neww!", newPlayersList);
      const { gameCode } = this.props;
      this.gamesCollection.updateOne(
        { gameCode },
        {
          $set: {
            playersList: newPlayersList,
            pendingPlayerAction: "",
          },
          $inc: {
            turnNumber: 1,
          },
        }
      );
    }
  };

  shouldDisplayPendingPlayerAction = () => {
    const { pendingPlayerAction } = this.state;
    if (pendingPlayerAction) {
      const objectNoun = pendingPlayerAction === "giving" ? "clue" : "card";
      return (
        <h4>{`${this.props.playerName} is ${pendingPlayerAction} a ${objectNoun}.`}</h4>
      );
    }
    // Not right
    return <h4>{`${this.props.playerName}'s turn!`}</h4>;
  };

  shouldDisplayMyTurnActions = () => {
    if (this.state.isItMyTurn) {
      return (
        <div>
          <button onClick={this.giveClue}>Give a clue</button>
          <button onClick={this.playCard}>Play a card</button>
          <button onClick={this.discardCard}>Discard a card</button>
        </div>
      );
    }
    return null;
  };

  getTurnConfirmationMessage = (pendingPlayerAction) => {
    let messageText, buttonText;
    switch (pendingPlayerAction) {
      case "giving":
        messageText =
          'Give a clue to another player. Then press "End Turn" button.';
        buttonText = "End Turn";
        break;
      case "playing":
        messageText = 'Select a card to play. Then press "Play" button.';
        buttonText = "Play";
        break;
      case "discarding":
        messageText = 'Select a card to discard. Then press "Discard" button.';
        buttonText = "Discard";
        break;
      default:
        messageText = "N/A";
        buttonText = "N/A";
        break;
    }
    return { messageText, buttonText };
  };

  shouldDisplayMyTurnConfirmation = () => {
    const { isItMyTurn, pendingPlayerAction } = this.state;
    if (isItMyTurn && pendingPlayerAction) {
      const { messageText, buttonText } = this.getTurnConfirmationMessage(
        pendingPlayerAction
      );
      return (
        <div>
          <p>{messageText}</p>
          <button onClick={this.endTurn}>{buttonText}</button>
        </div>
      );
    }
    return null;
  };

  render() {
    // console.log("render", this.state);
    const { localizedPlayersList, pendingPlayerAction } = this.state;

    if (localizedPlayersList.length === 0) {
      return null;
    }

    return (
      <div>
        <div>
          <h3>Game Board</h3>
          {this.shouldDisplayPendingPlayerAction()}
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
            {localizedPlayersList.map((player, index) => {
              return (
                <div key={`Player${index}-${player.playerName}`}>
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
            <div>
              <p>Played Cards</p>
            </div>
            <div>
              <p>Discarded Cards</p>
            </div>
          </div>
          <div>
            <p>My cards</p>
            {this.state.myPlayer.hand.map((card) => (
              <p key={`${card.cardName}-${card.keyCopy}`}>{card.cardName}</p>
            ))}
          </div>
          {this.shouldDisplayMyTurnActions()}
          {this.shouldDisplayMyTurnConfirmation()}
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
    playerName: hardcodedPlayersList[1],
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(GameBoard);
