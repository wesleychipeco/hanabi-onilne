import React, { PureComponent } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import uuid from "react-uuid";
import {
  setGameCode,
  setDeckName,
  setHostName,
} from "../store/gameActionCreator";
import { getGameStateSelectors } from "../store/gameReducer";
import {
  returnMongoCollection,
  deleteInsertMongo,
  findMongo,
} from "../utils/databaseManagement";

class HostWelcome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      decks: [],
      isModalVisible: false,
      name: "",
    };
    this.decksCollection = returnMongoCollection("decks");
    this.gamesCollection = returnMongoCollection("games");
  }

  componentDidMount() {
    // On mount, populate decks from mongodb
    this.decksCollection
      .find({})
      .asArray()
      .then((docs) => {
        this.setState({ decks: docs });
      });
  }

  selectDeck = (deckName) => {
    // Set deck in mongo and show modal
    this.props.setDeckName(deckName);
    this.setState({ isModalVisible: true });
  };

  generateUniqueGameCode = async () => {
    // While loop to create a non-existing, unique game code
    let counter = 0;
    while (true) {
      counter += 1;
      const gameCode = uuid().slice(0, 4).toUpperCase();

      const duplicateGameCodes = await findMongo(this.gamesCollection, {
        gameCode,
      });

      // If no duplicate game codes, set and return
      if (duplicateGameCodes.length === 0) {
        this.props.setGameCode(gameCode);
        return gameCode;
      }

      // If cannot generate unique game code in 10 attempts, stop
      if (counter > 10) {
        console.log(
          "Duplicate game codes after 10 attempts. Stopping infinite loop"
        );
        return undefined;
      }
    }
  };

  handleSubmit = async (event) => {
    const { setHostName, history, deckName } = this.props;
    const { name } = this.state;
    event.preventDefault();

    setHostName(name);
    const gameCode = await this.generateUniqueGameCode();
    // If error out, stop
    if (!gameCode) {
      return;
    }

    // Add base new game object
    const newGameObject = {
      hostName: name,
      deckName,
      gameCode,
      playerNames: [],
      isGameStarted: false,
    };
    const insertComplete = await deleteInsertMongo(
      this.gamesCollection,
      newGameObject,
      { gameCode }
    );

    if (insertComplete) {
      // navigate to Waiting Room
      history.push("/waiting-room");
    } else {
      alert("Error creating game.");
    }
  };

  handleTextInputChange = (event) => {
    this.setState({ name: event.target.value });
  };

  shouldRenderModal = () => {
    if (this.state.isModalVisible) {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgb(128,128,128)",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ width: "50%", height: "50%", backgroundColor: "red" }}>
            <form onSubmit={this.handleSubmit}>
              <label>
                Please enter your name:
                <input
                  type="text"
                  name="hostName"
                  onChange={this.handleTextInputChange}
                />
              </label>
              <input type="submit" value="Enter" />
            </form>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <h1>Host Welcome Page!</h1>
        <Link to="/">Home Page</Link>
        <h2>Select a deck to play with</h2>
        <div>
          {this.state.decks.map((deck) => (
            <button
              key={deck.deckName}
              onClick={() => this.selectDeck(deck.deckName)}
            >
              {deck.deckName}
            </button>
          ))}
        </div>
        {this.shouldRenderModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getDeckName } = getGameStateSelectors(state);

  return {
    deckName: getDeckName(),
  };
};

const mapDispatchToProps = {
  setGameCode,
  setDeckName,
  setHostName,
};

const reduxConnectFn = connect(mapStateToProps, mapDispatchToProps);

export default compose(reduxConnectFn, withRouter)(HostWelcome);
