import cardDeckService from '../services/card-deck-service';

// TODO change to database
let games = [];

let STAGES = {
    DEAL : 'deal',
    FLOP : 'flop',
    TURN : 'turn',
    RIVER : 'river',
    SHOWDOWN : 'showdown'
}

// ROUTES FOR OUR API
// =============================================================================
let express = require('express');
let router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    return res.json(cardDeckService.getShuffledDeckOfCards());   
});

router.post('/newgame', function(req, res) {
    let newGame = {
        id : games.length,
        deck : cardDeckService.getShuffledDeckOfCards(),
        players : [],
        nextStage : STAGES.DEAL,
        communityCards : []
    }
    console.log("Creating new game with id " + newGame.id);
    games.push(newGame);
    
    return res.status(201).json(newGame.id);
});

var mapGameStateToClientGameState = function(gameState) {
    let clientGameState = Object.assign({}, gameState);
    delete clientGameState.deck;

    return clientGameState;
}

router.get('/game/:gameId', function(req, res) {
    let gameId = req.params.gameId;
    console.log("Game with id " + gameId + " requested");
   
    if (gameId < 0 || gameId >= games.length) {
        return res.status(404).send("Game with id " + gameId + " does not exist!");
    }

    return res.json(mapGameStateToClientGameState(games[gameId]));
});

router.put('/game/:gameId/addplayer', function(req, res) {
    let gameId = req.params.gameId;

    if (gameId == undefined || gameId == null || gameId < 0 || gameId >= games.length) {
        return res.status(404).send("Cannot add new player to the game with id " + gameId + ", beacuse the game does not exist!");
    } else if (games[gameId].nextStage != STAGES.DEAL) {
        return res.status(409).send("Cannot add new player at this stage of the game! Please wait forthe round to end.");
    }
    
    let newPlayerId = gameId.toString() + games[gameId].players.length;
    games[gameId].players.push({
        id : newPlayerId,
        name : req.body.name,
        hand : []
    });
    console.log(`created new Player with id ${newPlayerId}`);
    return res.json(mapGameStateToClientGameState(games[gameId]));
});

router.put('/game/:gameId/dealcards', function(req, res) {
    let gameId = req.params.gameId;

    console.log("Dealing cards for players in game " + gameId);

    if (gameId < 0 || gameId >= games.length) {
        return res.status(404).send("Cannot deal cards to players in the game with id " + gameId + ", beacuse the game does not exist!");
    } else if (games[gameId].players.length == 0) {
        return res.status(409).send("Cannot deal cards to players in the game with id " + gameId + ", beacuse there are no players!");
    } else if (games[gameId].nextStage != STAGES.DEAL) {
        return res.status(409).send("Cannot deal the cards at this stage of the game!");
    }
    // TODO implement max number of players
    games[gameId].players.forEach(player => {
        player.hand = games[gameId].deck.splice(0, 2);
    });

    games[gameId].nextStage = STAGES.FLOP;

    return res.json(mapGameStateToClientGameState(games[gameId]));
});

router.put('/game/:gameId/flop', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.FLOP) {
        return res.status(409).send("Cannot do the flop at this stage of the game!");
    } else {
        let flop = games[gameId].deck.splice(0,3);
        games[gameId].nextStage = STAGES.TURN;
        games[gameId].communityCards = games[gameId].communityCards.concat(flop);
        return res.json(mapGameStateToClientGameState(games[gameId]));
    }
});

router.put('/game/:gameId/turn', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.TURN) {
        return res.status(409).send("Cannot do the turn at this stage of the game!");
    } else {
        let turn = games[gameId].deck.splice(0,1);
        games[gameId].nextStage = STAGES.RIVER;
        games[gameId].communityCards = games[gameId].communityCards.concat(turn);
        return res.json(mapGameStateToClientGameState(games[gameId]));
    }
});

router.put('/game/:gameId/river', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.RIVER) {
        return res.status(409).send("Cannot do the river at this stage of the game!");
    } else {
        let river = games[gameId].deck.splice(0,1);
        games[gameId].nextStage = STAGES.SHOWDOWN;
        games[gameId].communityCards = games[gameId].communityCards.concat(river);
        return res.json(mapGameStateToClientGameState(games[gameId]));
    }
});

router.options("/*", function(req, res, next){
    console.log("OPTIONS requested")
    console.log(req);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

export default router;


