import React, { Component } from 'react';
import GameService from '@services/game-service';
import PlayerListContainer from './PlayerList/PlayerListContainer';
import CardDealerContainer from './GameCardDealer/CardDealerContainer';
import GameTable from './GameTable/GameTable'

class GameContainer extends Component {

  constructor(props) {
    super(props);
    let id = this.props.match.params.id;
    this.state = { gameId : id , players: [], communityCards: []};
    this.gameService = new GameService(id);
    this.onGameStateChanged = this.onGameStateChanged.bind(this);
  }

  componentDidMount() {
    console.log(this.state);
    this.gameService.getGameState()
      .then(gameState => this.onGameStateChanged(gameState))
      .catch(// TODO redirect to 404
        err => {console.log(err.message);}
      );
  }

  onGameStateChanged(gameState) {
    console.log(gameState);
    this.setState({
      ...this.state,
      ...gameState
    });
  }

  mapStateToPlayerListState() {
    return Object.assign({}, {
      gameId : this.state.gameId,
      players : this.state.players,
      nextStage : this.state.nextStage
    });
  }

  mapStateToCardDealerState() {
    return Object.assign({},{
      gameId : this.state.gameId,
      nextStage : this.state.nextStage
    });
  }

  render() {
    return (
      <div>
        <PlayerListContainer state={this.mapStateToPlayerListState()} onGameStateChanged={(gameState) => this.onGameStateChanged(gameState)}/>
        <CardDealerContainer state={this.mapStateToCardDealerState()} onGameStateChanged={(gameState) => this.onGameStateChanged(gameState)}/>
        <GameTable cards={this.state.communityCards}/>
      </div>
    );
  }
}

export default GameContainer;