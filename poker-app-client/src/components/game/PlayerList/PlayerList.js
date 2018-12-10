import React from 'react';
import Player from './Player/Player';

function PlayerList(props) {
    let playerList = props.state.players.map(
        player => <li key={player.id}>
                    <Player player={player} />
                </li>
    );
    return (
        <div>
            <h3>Player List</h3>
            <ul>{playerList}</ul>
        </div>
    );
}

export default PlayerList;