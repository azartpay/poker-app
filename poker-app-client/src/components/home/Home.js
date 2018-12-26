import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.less';
import NewGameService from '@services/new-game-service';
import CardService from '@services/card-service';

class Home extends Component {

    constructor(props) {
        super(props);
        this.newGameService = new NewGameService();
        this.cardService = new CardService();
        this.createNewGame = this.createNewGame.bind(this);
        this.cardImage = this.cardService.getCardImage("S","A");
    }

    createNewGame() {
        this.newGameService.createNewGame()
            .then(gameId => this.props.history.push("/game/" + gameId))
            .catch(error => console.log(error.message));
    }

    render() {
        return (
        <div className="home">
            <div className="background"></div>
            <div className="columnLeft">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nisl urna. Praesent aliquet ultrices nulla, eget gravida diam ultricies id. Praesent a sollicitudin sapien. Sed ut scelerisque augue. Proin sollicitudin, odio quis egestas varius, sem enim laoreet arcu, ac volutpat nisl magna nec lorem.</p>
            </div>
            <div className="columnRight">
                <img  alt={this.cardImage} src={this.cardImage}/>
            </div>
        </div>
        );
    }
}

export default withRouter(Home);