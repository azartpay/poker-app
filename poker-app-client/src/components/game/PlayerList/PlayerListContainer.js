import React, { Component } from 'react';
import GameService from '@services/game-service';
import PlayerList from './PlayerList';
import PlayerForm from './PlayerForm/PlayerForm';

class PlayerListContainer extends Component {

    constructor(props) {
        super(props);
        this.gameService = new GameService(this.props.state.gameId);
        this.addPlayer = this.addPlayer.bind(this);
    }

    addPlayer(player) {
        this.gameService.addPlayer(player)
            .then(gameState => this.props.onGameStateChanged(gameState))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <PlayerList state={this.props.state} />
                {
                    this.props.state.nextStage === 'deal' && 
                    <PlayerForm onAddPlayer={(player) => this.addPlayer(player)} />
                }
            </div>
        );
    }
}

export default PlayerListContainer;