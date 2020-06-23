import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { getGameStateSelectors } from "../store/gameReducer";

class WaitingRoom extends PureComponent {
  componentDidMount() {
    const { deckName, gameCode, hostName, history } = this.props;
    if (!deckName && !gameCode && !hostName) {
      history.push("/");
    }
  }

  render() {
    return (
      <div>
        <h1>Waiting Room!</h1>
        <h3>{`Playing with deck: ${this.props.deckName}`}</h3>
        {this.props.gameCode && <h3>{`Game Code: ${this.props.gameCode}`}</h3>}
        <h3>List of Players:</h3>
        <h4>Host: {this.props.hostName}</h4>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode, getDeckName, getHostName } = getGameStateSelectors(
    state
  );

  return {
    gameCode: getGameCode(),
    deckName: getDeckName(),
    hostName: getHostName(),
  };
};

const reduxConnectFn = connect(mapStateToProps);

export default compose(reduxConnectFn, withRouter)(WaitingRoom);
