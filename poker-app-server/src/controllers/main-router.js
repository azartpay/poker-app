import cardDeckService from '../services/card-deck-service';
import express from 'express';
import gameService from '../services/game-service';

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
        gameService.addPlayer(gameId, player);
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
    try {
        return res.json(gameService.dealCardsToPlayers(gameId));
    } catch (err) {
        return res.json(err.statusCode).send(err.message);
    }
});

/**
 * Performs the flop stage in the game - takes three cards from the deck
 * and adds them to the game's community cards
 * 
 * @returns updated game state object
 */
router.put('/game/:gameId/flop', function(req, res) {
    let gameId = req.params.gameId;
    try {
        return res.json(gameService.doFlop(gameId));
    } catch (err) {
        res.json(err.statusCode).send(err.message);
    }
});

/**
 * Performs the turn stage in the game - takes one cards from the deck
 * and adds it to the game's community cards
 * 
 * @returns updated game state object
 */
router.put('/game/:gameId/turn', function(req, res) {
    let gameId = req.params.gameId;
    try {
        return res.json(gameService.doTurn(gameId));
    } catch (err) {
        res.json(err.statusCode).send(err.message);
    }
});

router.put('/game/:gameId/river', function(req, res) {
    let gameId = req.params.gameId;
    try {
        return res.json(gameService.doRiver(gameId));
    } catch (err) {
        res.json(err.statusCode).send(err.message);
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


