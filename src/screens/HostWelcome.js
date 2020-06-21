import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import uuid from "react-uuid";
import { setGameCode, setDeckName } from "../store/gameActionCreator";
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
    const { setGameCode, setDeckName, history } = this.props;
    const code = uuid().slice(0, 4).toUpperCase();
    setGameCode(code);
    //setDeckName(!!!!!!)
    history.push("/waiting-room");
  };

  render() {
    return (
      <div>
        <h1>Host Welcome Page!</h1>
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

const mapDispatchToProps = {
  setGameCode,
  setDeckName,
};

const reduxConnectFn = connect(null, mapDispatchToProps);

export default compose(reduxConnectFn, withRouter)(HostWelcome);
