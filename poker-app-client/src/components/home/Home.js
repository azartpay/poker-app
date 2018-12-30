import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.less';
import NewGameService from '@services/new-game-service';
import { resolveCardImage } from '@services/card-image-resolver';
import { resolveIcon } from '@services/icon-resolver';

class Home extends Component {

    constructor(props) {
        super(props);
        this.newGameService = new NewGameService();
        this.createNewGame = this.createNewGame.bind(this);
        this.cardImage = resolveCardImage("S","A");
        this.logoIcon = resolveIcon("chip.png");
    }

    createNewGame() {
        this.newGameService.createNewGame()
            .then(gameId => this.props.history.push("/game/" + gameId))
            .catch(error => console.log(error.message));
    }

    render() {
        return (
        <div className="home container container--flex-row">
            <div className="home__background"></div>
            <div className="column-left container container--flex-column">
                <div className="column-left-content container container--flex-column">
                    <div className="column-left-content-header container container--flex-row">
                        <img className="column-left-content-header__icon" alt="Logo icon" src={this.logoIcon}></img>
                        <h1 className="column-left-content-header__text">The poker app</h1>
                    </div>
                    <p className="primary-text-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nisl urna. Praesent aliquet ultrices nulla, eget gravida diam ultricies id. Praesent a sollicitudin sapien. Sed ut scelerisque augue. Proin sollicitudin, odio quis egestas varius, sem enim laoreet arcu, ac volutpat nisl magna nec lorem.</p>
                    <div className="column-left-content__buttons-container container container--flex-column">
                        <a href="/create-game" className="anchor-button anchor-button--success" title="Create new game">Create new game</a>
                        <a href="/join-game" className="anchor-button" title="Join existing game">Join existing game</a>
                    </div>
                </div>
            </div>
            <div className="column-right">
                <img className="column-right__card-image" alt={this.cardImage} src={this.cardImage}/>
            </div>
        </div>
        );
    }
}

export default withRouter(Home);