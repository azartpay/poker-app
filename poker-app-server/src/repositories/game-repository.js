import RepositoryException from '../common/errors/repository-exception';

class GameRepository {
    
    constructor() {
        this.games = [];
    }

    /**
     * Gets the game.
     * 
     * @param {number} id of the requested game 
     * @returns {Object} game state object
     * 
     * @throws {RepositoryException} when game with specified id does not exist.
     */
    get(id = -1) {
        if (this.gameWithSuchIdDoesntExist(id))
            throw new RepositoryException(`Game with id ${id} does not exist!`);
        return this.games[id];
    }
    
    /**
     * Saves new game state object
     * 
     * @param {Object} game the new game state object
     * @returns {Object} saved game state object
     */
    put(game) {
        game.id = this.games.length;
        this.games.push(game);
        return game;
    }

    /**
     * Updates the game state
     * 
     * @param {Object} newVersion
     * @returns {Object} updated game state object
     */
    update(newVersion = {}) {
        const id = newVersion.id;
        this.games[id] = Object.assign({}, this.games[id], newVersion);
        return this.games[id];
    }

    gameWithSuchIdDoesntExist(id = -1) {
        return id < 0 || id >= this.games.length;
    }

}

const gameRepository = new GameRepository();
export default gameRepository;