import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { setGameCode } from "../store/gameActionCreator";
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
    event.preventDefault();

    const isExistingOpenGame = await findMongo(this.gamesCollection, {
      gameCode,
    });

    if (isExistingOpenGame.length === 0) {
      alert("Game code does not exist. Please try entering game code again.");
    } else if (isExistingOpenGame[0].isGameStarted) {
      alert("Game is already in progress. Sorry!");
    } else {
      this.props.setGameCode(gameCode);
      const isPushed = await pushToArrayMongo(
        this.gamesCollection,
        { gameCode },
        { playerNames: name }
      );

      if (isPushed) {
        this.props.history.push("/waiting-room");
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
};

const reduxConnectFn = connect(null, mapDispatchToProps);

export default compose(reduxConnectFn, withRouter)(PlayerWelcome);
