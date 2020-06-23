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
      gameCode: "",
      hostName: "",
      playerNames: [],
    };
  }

  async componentDidMount() {
    const { gameCode } = this.props;
    const gamesCollection = returnMongoCollection("games");

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

  render() {
    const { deckName, gameCode, hostName, playerNames } = this.state;
    return (
      <div>
        <h1>Waiting Room!</h1>
        <h3>{`Playing with deck: ${deckName}`}</h3>
        {gameCode && <h3>{`Game Code: ${gameCode}`}</h3>}
        <h3>List of Players:</h3>
        <h5>{`${hostName} - Host`}</h5>
        {playerNames.map((playerName) => (
          <h5 key={playerName}>{playerName}</h5>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode } = getGameStateSelectors(state);

  return {
    gameCode: getGameCode(),
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(WaitingRoom);
