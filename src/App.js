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
            <HomePage {...this.props} />
          </Route>
          <Route exact path="/host-welcome">
            <HostWelcome {...this.props} />
          </Route>
          <Route exact path="/player-welcome">
            <PlayerWelcome {...this.props} />
          </Route>
          <Route exact path="/waiting-room">
            <WaitingRoom {...this.props} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withScreenSize(App);
