import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/home/Home';
import GameContainer from './components/game/GameContainer';
import CreateGameContainer from './components/create-game/CreateGameContainer';
import JoinGameContainer from './components/join-game/JoinGameContainer';
import './styles/index.less';

class App extends Component {

  render() {
    return (
        <Router>
          <div className="container container--flex-row">
            <Route exact path="/" component={Home}/>
            <Route path="/game/:id" component={GameContainer}/>
            <Route path="/create-game" component={CreateGameContainer}/>
            <Route path="/join-game" component={JoinGameContainer}/>
          </div>
        </Router>
    );
  }
}

export default App;
