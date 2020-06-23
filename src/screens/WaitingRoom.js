import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { getGameStateSelectors } from "../store/gameReducer";
import { returnMongoCollection, findMongo } from "../utils/databaseManagement";

class WaitingRoom extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      deckName: "",
      hostName: "",
      playerNames: [],
    };
  }

  async componentDidMount() {
    const { gameCode } = this.props;
    const gamesCollection = returnMongoCollection("games");

    // Put values from Mongo into state
    const gameObjectArray = await findMongo(gamesCollection, { gameCode });
    if (gameObjectArray.length === 1) {
      const gameObject = gameObjectArray[0];
      const { deckName, hostName, playerNames } = gameObject;
      this.setState({
        deckName,
        hostName,
        playerNames,
      });
    } else {
      console.log("No waiting room exists, re-route to Home");
      this.props.history.push("/");
    }
  }

  renderHostOnlyStartGameButton = () => {
    const isButtonDisabled = this.state.playerNames.length === 0;
    if (this.props.playerName === this.state.hostName) {
      return (
        <button
          disabled={isButtonDisabled}
          onClick={this.startGame}
          style={{
            width: 150,
            height: 75,
            backgroundColor: isButtonDisabled
              ? "rgb(192,192,192)"
              : "rgb(50,205,50)",
          }}
        >
          Start Game!
        </button>
      );
    }
    return <h4>Wait for the host to start the game</h4>;
  };

  startGame = () => {
    console.log("START GAME!!!!!!!!!!");
  };

  render() {
    const { deckName, hostName, playerNames } = this.state;
    const { gameCode, playerName } = this.props;
    const meHostText = this.props.playerName === hostName ? " - ME" : "";

    return (
      <div>
        <h1>Waiting Room!</h1>
        <h3>{`Playing with deck: ${deckName}`}</h3>
        {gameCode && <h3>{`Game Code: ${gameCode}`}</h3>}
        <h3>List of Players:</h3>
        <h5>{`${hostName} - Host${meHostText}`}</h5>
        {playerNames.map((playerNameMap) => {
          const mePlayerText = playerNameMap === playerName ? " - ME" : "";
          return (
            <h5 key={playerNameMap}>{`${playerNameMap}${mePlayerText}`}</h5>
          );
        })}
        {this.renderHostOnlyStartGameButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode, getPlayerName } = getGameStateSelectors(state);

  return {
    gameCode: getGameCode(),
    playerName: getPlayerName(),
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(WaitingRoom);
