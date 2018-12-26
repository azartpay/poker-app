import cardDeckService from './card-deck-service';
import gameRepository from '../repositories/game-repository';
import ServiceException from '../common/errors/service-exception';

const STAGES = {
    DEAL : 'deal',
    FLOP : 'flop',
    TURN : 'turn',
    RIVER : 'river',
    SHOWDOWN : 'showdown'
};

class GameService {

    constructor(gameRepository, cardDeckService) {
        this.gameRepository = gameRepository;
        this.cardDeckService = cardDeckService;
    }

    /**
     * Creates new game.
     * 
     * @returns {Object} game state object of the newly created game
     */
    createNewGame() {
        let newGame = {
            deck : this.cardDeckService.getShuffledDeckOfCards(),
            players : [],
            nextStage : STAGES.DEAL,
            communityCards : []
        }
        const createdGame = this.gameRepository.put(newGame);
        return this.mapGameStateToClientGameState(createdGame);
    }

    /**
     * Gets the game.
     * 
     * @param {number} id of the requested game 
     * @returns {Object} game state object
     * 
     * @throws {ServiceException} when game with specified id does not exist
     */
    getGame(id = -1) {
        const game = this.getGameInternal(id);
        return this.mapGameStateToClientGameState(game);
    }

    /**
     * Adds new player to the specified game
     * 
     * @param {number} gameId id of the game
     * @param {Object} player player to be added to the game
     * @returns {Object} updated game state
     * 
     * @throws {ServiceException} when the state of the game does not allow adding new players or the game does not exist
     */
    addPlayerToGame(gameId, player = {name}) {
        const gameToUpdate = this.getGameInternal(gameId);
        
        if (this.isAddingPlayersToGameBlocked(gameToUpdate))
            throw new ServiceException(409, `Cannot add new player at this stage of the game! Please wait for the round to end.`);
        
        gameToUpdate.players.push(this.setupPlayerForGame(gameToUpdate, player));
        return this.gameRepository.update(gameToUpdate); 
    }

    mapGameStateToClientGameState(gameState) {
        let clientGameState = Object.assign({}, gameState);
        delete clientGameState.deck;
        return clientGameState;
    }

    getGameInternal(id) {
        try {
            const game = this.gameRepository.get(id);
            return this.mapGameStateToClientGameState(game);
        } catch (err) {
            throw new ServiceException(404, err.message, err);
        }
    }

    setupPlayerForGame(game, player) {
        player.id = game.id.toString() + game.players.length;
        player.hand = [];
        return player;
    }

    isAddingPlayersToGameBlocked(game) {
        return game.nextStage != STAGES.DEAL;
    }
}

const gameService = new GameService(gameRepository, cardDeckService);
export { gameService, STAGES as GAME_STAGES };
