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

    this.gamesCollection = returnMongoCollection("games");
  }

  async componentDidMount() {
    await this.updateWithNewMongoData(true);
    await this.startListening();
  }

  updateWithNewMongoData = async (shouldReroute = false) => {
    const { gameCode } = this.props;
    // Put values from Mongo into state
    const gameObjectArray = await findMongo(this.gamesCollection, { gameCode });
    if (gameObjectArray.length === 1) {
      const gameObject = gameObjectArray[0];
      if (gameObject.isGameStarted) {
        this.props.history.push("/game-board");
      } else {
        const { deckName, hostName, playerNames } = gameObject;
        this.setState({
          deckName,
          hostName,
          playerNames,
        });
      }
    } else if (shouldReroute) {
      console.log("No waiting room exists, re-route to Home");
      this.props.history.push("/");
    }
  };

  shouldUpdateRender = async (changeEvent) => {
    const { gameCode } = this.props;
    if (
      changeEvent?.operationType === "update" &&
      changeEvent?.fullDocument?.gameCode === gameCode
    ) {
      await this.updateWithNewMongoData(false);
    }
  };

  startListening = async () => {
    const ok = await this.gamesCollection.watch();
    ok.onNext(async (changeEvent) => {
      console.log("new update!", changeEvent);
      await this.shouldUpdateRender(changeEvent);
    });
  };

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
    const { gameCode } = this.props;
    this.gamesCollection.updateOne(
      { gameCode },
      { $set: { isGameStarted: true } }
    );
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
