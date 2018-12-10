import React from 'react';

function CardDealer(props) {
    return(
        <div>
            {props.nextStage === 'deal' && <button onClick={props.onDeal}>Deal cards</button>}
            {props.nextStage === 'flop' && <button onClick={props.onFlop}>Flop</button>}
            {props.nextStage === 'turn' && <button onClick={props.onTurn}>Turn</button>}
            {props.nextStage === 'river' && <button onClick={props.onRiver}>River</button>}
        </div>
    );
}

export default CardDealer;