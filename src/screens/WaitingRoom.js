import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getGameStateSelectors } from "../store/gameReducer";

class WaitingRoom extends PureComponent {
  render() {
    return (
      <div>
        <h1>Waiting Room!</h1>
        <h3>{`Playing with deck: ${this.props.deckName}`}</h3>
        {this.props.gameCode && <h3>{`Game Code: ${this.props.gameCode}`}</h3>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getGameCode, getDeckName } = getGameStateSelectors(state);

  return {
    gameCode: getGameCode(),
    deckName: getDeckName(),
  };
};

export default connect(mapStateToProps)(WaitingRoom);
