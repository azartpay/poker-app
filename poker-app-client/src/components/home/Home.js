import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.less';
import NewGameService from '@services/new-game-service';

class Home extends Component {

    constructor(props) {
        super(props);
        this.newGameService = new NewGameService();
        this.createNewGame = this.createNewGame.bind(this);
    }

    createNewGame() {
        this.newGameService.createNewGame()
            .then(gameId => this.props.history.push("/game/" + gameId))
            .catch(error => console.log(error.message));
    }

    render() {
        return (
        <div className="home">
            <div className="background-bar">
                <button className="flat-button-large" onClick={this.createNewGame}>Create new game</button>
            </div>
        </div>
        );
    }
}

//() => {} 

export default withRouter(Home);