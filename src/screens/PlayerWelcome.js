import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { setGameCode, setPlayerName } from "../store/gameActionCreator";
import {
  returnMongoCollection,
  findMongo,
  pushToArrayMongo,
} from "../utils/databaseManagement";

class PlayerWelcome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      gameCode: "",
    };
    this.gamesCollection = returnMongoCollection("games");
  }

  handleSubmit = async (event) => {
    const { name, gameCode } = this.state;
    const { setGameCode, setPlayerName, history } = this.props;
    event.preventDefault();

    const isExistingOpenGame = await findMongo(this.gamesCollection, {
      gameCode,
    });

    if (isExistingOpenGame.length === 0) {
      alert("Game code does not exist. Please try entering game code again.");
    } else if (isExistingOpenGame[0].isGameStarted) {
      alert("Game is already in progress. Please join another game. Sorry!");
    } else if (isExistingOpenGame[0].playerNames.length >= 4) {
      alert("Game is already full of players. Max 5 players.");
    } else {
      setGameCode(gameCode);
      setPlayerName(name);
      const isPushed = await pushToArrayMongo(
        this.gamesCollection,
        { gameCode },
        { playerNames: name }
      );

      if (isPushed) {
        history.push("/waiting-room");
      } else {
        alert("Error adding player to game. Please try again");
      }
    }
  };

  handlePlayerNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleGameCodeChange = (event) => {
    this.setState({ gameCode: event.target.value });
  };

  render() {
    return (
      <div>
        <h1>Player Welcome Page!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Please enter your name:
            <input
              type="text"
              name="playerName"
              onChange={this.handlePlayerNameChange}
            />
          </label>
          <label>
            Please enter the game code:
            <input
              type="text"
              name="gameCode"
              onChange={this.handleGameCodeChange}
            />
          </label>
          <input type="submit" value="Enter" />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setGameCode,
  setPlayerName,
};

const reduxConnectFn = connect(null, mapDispatchToProps);

export default compose(reduxConnectFn, withRouter)(PlayerWelcome);
