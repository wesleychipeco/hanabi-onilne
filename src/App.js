import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./screens/HomePage";
import HostWelcome from "./screens/HostWelcome";
import PlayerWelcome from "./screens/PlayerWelcome";
import WaitingRoom from "./screens/WaitingRoom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }

  render() {
    return (
      <div
        className="App"
        style={{
          width: this.state.width,
          height: this.state.height,
          flex: 1,
        }}
      >
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/host-welcome">
            <HostWelcome />
          </Route>
          <Route exact path="/player-welcome">
            <PlayerWelcome />
          </Route>
          <Route exact path="/waiting-room">
            <WaitingRoom />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
