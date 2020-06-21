import React, { PureComponent } from "react";
import { connect } from "react-redux";
import uuid from "react-uuid";
import { getGameStateSelectors } from "../store/gameReducer";
import { setGameCode } from "../store/gameActionCreator";

class HostWelcome extends PureComponent {
  generateCode = () => {
    const code = uuid().slice(0, 4).toUpperCase();
    this.props.setGameCode(code);
  };

  render() {
    return (
      <div>
        <h1>Host Welcome Page!</h1>
        <h3>{this.props.gameCode}</h3>
        <div>
          <button onClick={this.generateCode}>Generate code</button>
        </div>
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

const mapDispatchToProps = {
  setGameCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(HostWelcome);
