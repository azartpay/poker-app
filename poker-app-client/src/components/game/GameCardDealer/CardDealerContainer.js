import React, { Component } from 'react';
import GameService from '@services/game-service';
import CardDealer from './CardDealer';

class CardDealerContainer extends Component {

    constructor(props) {
        super(props);
        this.gameService = new GameService(this.props.state.gameId);
        this.dealCardsToPlayers = this.dealCardsToPlayers.bind(this);
        this.doFlop = this.doFlop.bind(this);
        this.doTurn = this.doTurn.bind(this);
        this.doRiver = this.doRiver.bind(this);
    }

    dealCardsToPlayers() {
        this.gameService.dealCards()
            .then(gameState => this.props.onGameStateChanged(gameState))
            .catch(err => console.log(err));
    }

    doFlop() {
        this.gameService.doFlop()
            .then(gameState => this.props.onGameStateChanged(gameState))
            .catch(err => console.log(err));
    }

    doTurn() {
        this.gameService.doTurn()
            .then(gameState => this.props.onGameStateChanged(gameState))
            .catch(err => console.log(err));
    }

    doRiver() {
        this.gameService.doRiver()
            .then(gameState => this.props.onGameStateChanged(gameState))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <CardDealer 
                    nextStage={this.props.state.nextStage}
                    onDeal={this.dealCardsToPlayers}
                    onFlop={this.doFlop}
                    onTurn={this.doTurn}
                    onRiver={this.doRiver} />
            </div>
        );
    }
}

export default CardDealerContainer;