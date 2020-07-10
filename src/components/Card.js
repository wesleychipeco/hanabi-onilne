import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCardsStateSelectors } from "../store/cardsReducer";
import { selectCard } from "../store/cardsActionCreator";

class Card extends PureComponent {
  static propTypes = {
    // PropTypes from parent
    selectable: PropTypes.bool,
    card: PropTypes.object.isRequired,
    // PropTypes from redux
    selectedCard: PropTypes.string.isRequired,
    selectCard: PropTypes.func.isRequired,
  };

  getUniqueCardName = () => {
    const { card } = this.props;
    return card ? `${card.cardName}-${card.keyCopy}` : "";
  };

  handleSelectCard = () => {
    const { selectable, selectCard, selectedCard } = this.props;
    if (selectable) {
      const uniqueCardName = this.getUniqueCardName();
      const newSelectedCard =
        uniqueCardName === selectedCard ? "" : uniqueCardName;
      selectCard(newSelectedCard);
    }
  };

  render() {
    const { card, selectedCard } = this.props;
    const selectedStyle =
      selectedCard === this.getUniqueCardName()
        ? { backgroundColor: "red" }
        : { backgroundColor: "gray" };

    return (
      <div
        style={{ width: 75, height: 50, margin: 5, ...selectedStyle }}
        onClick={this.handleSelectCard}
      >
        <p>{card.cardName}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { getSelectedCard } = getCardsStateSelectors(state);

  return {
    selectedCard: getSelectedCard(),
  };
};

const mapToDispatch = {
  selectCard,
};

const reduxConnectFn = connect(mapStateToProps, mapToDispatch);

export default reduxConnectFn(Card);
