import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./screens/HomePage";
import HostWelcome from "./screens/HostWelcome";
import PlayerWelcome from "./screens/PlayerWelcome";
import WaitingRoom from "./screens/WaitingRoom";
import withScreenSize from "./screens/withScreenSize";

class App extends Component {
  render() {
    return (
      <div className="App">
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

export default withScreenSize(App);
