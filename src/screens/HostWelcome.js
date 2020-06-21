import React, { PureComponent } from "react";
import { connect } from "react-redux";
import uuid from "react-uuid";
import { getGameStateSelectors } from "../store/gameReducer";
import { setGameCode } from "../store/gameActionCreator";
import { returnMongoCollection } from "../utils/databaseManagement";

class HostWelcome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      decks: [],
    };
  }

  componentDidMount() {
    const decksCollection = returnMongoCollection("decks");
    decksCollection
      .find({})
      .asArray()
      .then((docs) => {
        console.log("DOCS", docs);
        this.setState({ decks: docs });
      });
  }

  generateCode = () => {
    const code = uuid().slice(0, 4).toUpperCase();
    this.props.setGameCode(code);
  };

  render() {
    return (
      <div>
        <h1>Host Welcome Page!</h1>
        {this.props.gameCode && <h3>{`Game Code: ${this.props.gameCode}`}</h3>}
        <h2>Select a deck to play with</h2>
        <div>
          {this.state.decks.map((deck) => (
            <button key={deck.deckName} onClick={this.generateCode}>
              {deck.deckName}
            </button>
          ))}
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
