import React from 'react';
import CardContainer from '@components/game/GameCard/CardContainer';

import "./GameTable.less";

function GameTable(props) {
    let cardList = props.cards.map(card => <CardContainer key={`${card.suit}${card.value}`} suit={card.suit} value={card.value}/>);

    return(
        <div className="game-table">
            {cardList}
        </div> 
    );
}

export default GameTable;