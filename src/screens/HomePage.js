import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

class HomePage extends PureComponent {
  render() {
    return (
      <div>
        <h1>Welcome to Hanabi online!</h1>
        <div>
          <Link to="/host-welcome">Host Screen</Link>
          <Link to="/player-welcome">Player Screen</Link>
        </div>
      </div>
    );
  }
}

export default HomePage;
