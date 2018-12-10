import React from 'react';
import CardContainer from  '@components/game/GameCard/CardContainer';

function Player(props) {
    let player = props.player;
    let hand = player.hand ? player.hand.map(
        card => <CardContainer key={`${card.suit}${card.value}`} 
                    suit={card.suit} 
                    value={card.value} />
    ) : <p>No cards</p>;

    return(
        <div>
            <h2>{player.name}</h2>
            <div>
                <h3>Hand:</h3>{hand};
            </div>
        </div>
    );
}

export default Player;