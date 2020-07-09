import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Card extends PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
  };

  render() {
    const { card } = this.props;
    return (
      <div
        style={{ width: 75, height: 50, margin: 5, backgroundColor: "gray" }}
      >
        <p>{card.cardName}</p>
      </div>
    );
  }
}

export default Card;
