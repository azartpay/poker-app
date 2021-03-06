import { Game, STAGES } from '../interfaces/game-interface';
import cardDeckService, { CardDeckService } from './card-deck-service';
import gameRepository, { GameRepository } from '../repositories/game-repository';
import ServiceException from '../common/errors/service-exception';
import { Player } from '../interfaces/player-interface';

export class GameService {

    constructor(private gameRepository: GameRepository, private cardDeckService: CardDeckService) {
        this.gameRepository = gameRepository;
        this.cardDeckService = cardDeckService;
    }

    /**
     * Creates new game.
     *
     * @returns {Object} game state object of the newly created game
     */
    createNewGame() {
        let newGame: Game = {
            id : -1,
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
    addPlayer(gameId: number, player: Player) {
        const gameToUpdate = this.getGameInternal(gameId);
        this.checkIfAddingPlayersToGameAllowed(gameToUpdate);
        gameToUpdate.players.push(this.setupPlayerForGame(gameToUpdate, player));
        return this.mapGameStateToClientGameState(this.gameRepository.update(gameToUpdate));
    }

    /**
     * Deals cards to all the players in the game with specified id
     *
     * @param {number} gameId id of the game
     * @returns {Object} updated game state
     *
     * @throws {ServiceException} when the state of the game does not allow dealing cards or the game does not exist
     */
    dealCardsToPlayers(gameId = -1) {
        let gameToUpdate = this.getGameInternal(gameId);
        this.checkIfDealingCardsInGameAllowed(gameToUpdate);

        gameToUpdate.players.forEach(player => {
            player.hand = gameToUpdate.deck.splice(0, 2);
        });
        gameToUpdate.nextStage = STAGES.FLOP;

        return this.mapGameStateToClientGameState(gameRepository.update(gameToUpdate));
    }

    /**
     * Performs the flop stage in the game - takes three cards from the deck
     * and adds them to the game's community cards
     *
     * @param {number} gameId id of the game
     * @returns {Object} updated game state
     *
     * @throws {ServiceException} when the state of the game does not allow flop or the game does not exist
     */
    doFlop(gameId = -1) {
        let gameToUpdate = this.getGameInternal(gameId);
        this.checkIfFlopAllowed(gameToUpdate);
        let flop = gameToUpdate.deck.splice(0, 3);
        gameToUpdate.communityCards = gameToUpdate.communityCards.concat(flop);
        gameToUpdate.nextStage = STAGES.TURN;
        return this.mapGameStateToClientGameState(gameRepository.update(gameToUpdate));
    }

    /**
     * Performs the turn stage in the game - takes one card from the deck
     * and adds it to the game's community cards. Next stage is river.
     *
     * @param {number} gameId id of the game
     * @returns {Object} updated game state
     *
     * @throws {ServiceException} when the state of the game does not allow turn or the game does not exist
     */
    doTurn(gameId = -1) {
        let gameToUpdate = this.getGameInternal(gameId);
        this.checkIfTurnAllowed(gameToUpdate);
        let turn = gameToUpdate.deck.splice(0, 1);
        gameToUpdate.communityCards = gameToUpdate.communityCards.concat(turn);
        gameToUpdate.nextStage = STAGES.RIVER;
        return this.mapGameStateToClientGameState(gameRepository.update(gameToUpdate));
    }

    /**
     * Performs the river stage in the game - takes one card from the deck
     * and adds it to the game's community cards. Next stage is showdown.
     *
     * @param {number} gameId id of the game
     * @returns {Object} updated game state
     *
     * @throws {ServiceException} when the state of the game does not allow river or the game does not exist
     */
    doRiver(gameId = -1) {
        let gameToUpdate = this.getGameInternal(gameId);
        this.checkIfRiverAllowed(gameToUpdate);
        let river = gameToUpdate.deck.splice(0, 1);
        gameToUpdate.communityCards = gameToUpdate.communityCards.concat(river);
        gameToUpdate.nextStage = STAGES.SHOWDOWN;
        return this.mapGameStateToClientGameState(gameRepository.update(gameToUpdate));
    }

    checkIfAddingPlayersToGameAllowed(game: Game): void {
        if (this.gameNotInDealStage(game))
            throw new ServiceException(409, 'Cannot add new player at this stage of the game! Please wait for the round to end.');
    }

    checkIfDealingCardsInGameAllowed(game: Game): void {
        if (this.notEnoughPlayersInTheGame(game))
            throw new ServiceException(409, 'There must be minimum 2 players in the game to deal the cards.');

        if (this.gameNotInDealStage(game))
            throw new ServiceException(409, 'Cannot add new player at this stage of the game! Please wait for the round to end.');
    }

    checkIfFlopAllowed(game: Game) {
        if (game.nextStage != STAGES.FLOP)
            throw new ServiceException(409, 'Cannot do flop at this stage of the game!');
    }

    checkIfTurnAllowed(game: Game) {
        if (game.nextStage != STAGES.TURN)
            throw new ServiceException(409, 'Cannot do turn at this stage of the game!');
    }

    checkIfRiverAllowed(game: Game) {
        if (game.nextStage != STAGES.RIVER)
            throw new ServiceException(409, 'Cannot do river at this stage of the game!');
    }

    notEnoughPlayersInTheGame(game: Game): boolean {

        return game.players.length < 2;
    }

    mapGameStateToClientGameState(gameState: Game): Game {
        let clientGameState = Object.assign({}, gameState);
        delete clientGameState.deck;
        return clientGameState;
    }

    getGameInternal(id: number) {
        try {
            return this.gameRepository.get(id);
        } catch (err) {
            throw new ServiceException(404, err.message, err);
        }
    }

    setupPlayerForGame(game: Game, player: Player) {
        let gameId = game.id ? game.id : -1;
        player.id = gameId + game.players.length;
        player.hand = [];
        return player;
    }

    gameNotInDealStage(game: Game): boolean {
        return game.nextStage != STAGES.DEAL;
    }
}

const gameService = new GameService(gameRepository, cardDeckService);
export { gameService, STAGES as GAME_STAGES };
