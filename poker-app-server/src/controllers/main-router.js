import cardDeckService from '../services/card-deck-service';
import express from 'express';
import gameService from '../services/game-service';

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
let router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    return res.json(cardDeckService.getShuffledDeckOfCards());   
});

/**
 * Creates new game.
 * 
 * @returns game state object of the newly created game
 */
router.post('/newgame', function(req, res) {
    let newGame = gameService.createNewGame();
    return res.status(201).json(newGame.id);
});

/**
 * Gets the game with specified id
 * 
 * @returns game state object of requested game
 */
router.get('/game/:id', function(req, res) {
    const id = req.params.id;
    try {
        return res.json(gameService.getGame(id));
    } catch (err) {
        return res.status(err.statusCode).send(err.message);
    }
});

/**
 * Adds player to the game with specified id
 * 
 * @returns updated game state object
 */
router.put('/game/:id/addplayer', function(req, res) {
    const gameId = req.params.id;
    const player = { name : req.body.name };
    try {
        gameService.addPlayerToGame(gameId, player);
        return res.json(gameService.getGame(gameId));
    } catch (err) {
        return res.status(err.statusCode).send(err.message);
    }
});

/**
 * Deals cards to all the players in the game with specified id
 * 
 * @returns updated game state object
 */
router.put('/game/:id/dealcards', function(req, res) {
    let gameId = req.params.id;

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


