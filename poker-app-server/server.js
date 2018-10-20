// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cardDeckService = require('./services/card-deck-service');

// TODO change to database
let games = [];

let STAGES = {
    DEAL : 'deal',
    FLOP : 'flop',
    TURN : 'turn',
    RIVER : 'river',
    SHOWDOWN : 'showdown'
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    // TODO allow requests just from client or provide OPTIONS requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    return res.json(cardDeckService.getShuffledDeckOfCards());   
});

router.post('/newgame', function(req, res) {
    let newGame = {
        id : games.length,
        deck : cardDeckService.getShuffledDeckOfCards(),
        players : [],
        nextStage : STAGES.DEAL
    }
    console.log("Creating new game with id " + newGame.id);
    games.push(newGame);
    
    return res.json(newGame.id);
});

router.get('/game/:gameId', function(req, res) {
    let gameId = req.params.gameId;
    console.log("Game with id " + gameId + " requested");
   
    if (gameId < 0 || gameId >= games.length) {
        return res.status(404).send("Game with id " + gameId + " does not exist!");
    }
    let gameStateForClient = Object.assign({}, games[gameId]);
    delete gameStateForClient.deck;
    delete gameStateForClient.id;

    return res.json(gameStateForClient);
});

router.post('/game/:gameId/addplayer', function(req, res) {
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
    return res.json(games[gameId].players);
});

router.post('/game/:gameId/dealcards', function(req, res) {
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

    return res.json(games[gameId].players);
});

router.get('/game/:gameId/flop', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.FLOP) {
        return res.status(409).send("Cannot do the flop at this stage of the game!");
    } else {
        let flop = games[gameId].deck.splice(0,3);
        games[gameId].nextStage = STAGES.TURN;
        return res.json(flop);
    }
});

router.get('/game/:gameId/turn', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.TURN) {
        return res.status(409).send("Cannot do the turn at this stage of the game!");
    } else {
        let turn = games[gameId].deck.splice(0,1);
        games[gameId].nextStage = STAGES.RIVER;
        return res.json(turn);
    }
});

router.get('/game/:gameId/river', function(req, res) {
    let gameId = req.params.gameId;
    
    if (games[gameId].nextStage != STAGES.RIVER) {
        return res.status(409).send("Cannot do the river at this stage of the game!");
    } else {
        let river = games[gameId].deck.splice(0,1);
        games[gameId].nextStage = STAGES.SHOWDOWN;
        return res.json(river);
    }
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
