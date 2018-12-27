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
        <div className="home flex-container-row">
            <div className="background"></div>
            <div className="columnLeft flex-container-column">
                <div className="flex-container-column">
                    <div className="flex-container-row pokerAppHeader">
                        <img id="logo-icon" className="icon" alt="Logo icon" src={this.logoIcon}></img>
                        <h1>The poker app</h1>
                    </div>
                    <p className="primary-text-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nisl urna. Praesent aliquet ultrices nulla, eget gravida diam ultricies id. Praesent a sollicitudin sapien. Sed ut scelerisque augue. Proin sollicitudin, odio quis egestas varius, sem enim laoreet arcu, ac volutpat nisl magna nec lorem.</p>
                    <div className="homeScreenButtons flex-container-column">
                        <a href="#" className="anchor-button success" title="Create new game">Create new game</a>
                        <a href="#" className="anchor-button" title="Join existing game">Join existing game</a>
                    </div>
                </div>
            </div>
            <div className="columnRight">
                <img  alt={this.cardImage} src={this.cardImage}/>
            </div>
        </div>
        );
    }
}

export default withRouter(Home);