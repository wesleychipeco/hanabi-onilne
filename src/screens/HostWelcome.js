import React, { PureComponent } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import uuid from "react-uuid";
import {
  setGameCode,
  setDeckName,
  setHostName,
} from "../store/gameActionCreator";
import { returnMongoCollection } from "../utils/databaseManagement";

class HostWelcome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      decks: [],
      modalVisible: false,
      name: "",
    };
  }

  componentDidMount() {
    const decksCollection = returnMongoCollection("decks");
    decksCollection
      .find({})
      .asArray()
      .then((docs) => {
        this.setState({ decks: docs });
      });
  }

  generateCode = (deckName) => {
    const { setGameCode, setDeckName, history } = this.props;
    const code = uuid().slice(0, 4).toUpperCase();
    setGameCode(code);
    setDeckName(deckName);
    this.setState({ modalVisible: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.setHostName(this.state.name);
    this.props.history.push("/waiting-room");
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  };

  shouldRenderModal = () => {
    if (this.state.modalVisible) {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgb(128,128,128)",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ width: "50%", height: "50%", backgroundColor: "red" }}>
            <form onSubmit={this.handleSubmit}>
              <label>
                Please enter your name:
                <input
                  type="text"
                  name="hostName"
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Enter" />
            </form>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <h1>Host Welcome Page!</h1>
        <Link to="/">Home Page</Link>
        <h2>Select a deck to play with</h2>
        <div>
          {this.state.decks.map((deck) => (
            <button
              key={deck.deckName}
              onClick={() => this.generateCode(deck.deckName)}
            >
              {deck.deckName}
            </button>
          ))}
        </div>
        {this.shouldRenderModal()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setGameCode,
  setDeckName,
  setHostName,
};

const reduxConnectFn = connect(null, mapDispatchToProps);

export default compose(reduxConnectFn, withRouter)(HostWelcome);
