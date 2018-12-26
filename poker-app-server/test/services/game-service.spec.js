import chai from 'chai';
import sinon from 'sinon';
import { gameService, GAME_STAGES } from '../../src/services/game-service';
import gameRepository from '../../src/repositories/game-repository';
import RepositoryException from '../../src/common/errors/repository-exception';
import ServiceException from '../../src/common/errors/service-exception';
import cardDeckService from '../../src/services/card-deck-service';

const expect = chai.expect; // we are using the "expect" style of Chai

describe('GameService Tests', function() {
    const CORRECT_ID = 0;
    const INCORRECT_ID = 1;
    const NEW_ID = 2;
    const EXCEPTION_MESSAGE = 'Game with this id does not exist';
    let game = {};

    before(function(){
        sinon.stub(gameRepository, 'get').callsFake(
            sinon.fake(function(id) {
                if (id === CORRECT_ID) 
                    return game
                else
                    throw new RepositoryException(EXCEPTION_MESSAGE);
            })
        );
        
        sinon.stub(gameRepository, 'put').callsFake(
            sinon.fake(function(game) {
                game.id = NEW_ID;
                return game;
            })
        );

        sinon.stub(gameRepository, 'update').callsFake(
            sinon.fake(function(newVersion) {
                return Object.assign({}, game, newVersion);
            })
        );

        sinon.stub(cardDeckService, 'getShuffledDeckOfCards').callsFake(sinon.fake());
    });

    beforeEach(function() {
        game = {
            id : 0,
            deck : [],
            players : [],
            nextStage : GAME_STAGES.DEAL,
            communityCards : []
        }
    });

    it('getGame() should return a game state object without the deck of cards inside', function() {
        let actualGame = gameService.getGame(0);
        expect(actualGame).to.exist;
        expect(0).to.equal(actualGame.id);
        expect(actualGame.deck).to.not.exist;
    });

    it('getGame() should throw exception when trying to get a game that does not exist', function() {
        let err = chai.assert.throw(() => gameService.getGame(INCORRECT_ID));
        expect(err).to.be.instanceof(ServiceException);
        expect(err).to.have.property('name', 'ServiceException');
        expect(err).to.have.property('message', EXCEPTION_MESSAGE);
    });

    it('createNewGame() should return newly created game without the deck of cards inside', function() {
        let actualNewGame = gameService.createNewGame();
        expect(actualNewGame).to.exist;
        expect(NEW_ID).to.equal(actualNewGame.id);
        expect(actualNewGame.deck).to.not.exist;
    });

    it('addPlayerToGame() should add new player to game and return the updated game state', function() {
        let player = { name : "Test player" };
        const expectedPlayersArray = [ player ];
        let updatedGame = gameService.addPlayerToGame(CORRECT_ID, player);
        expect(updatedGame).to.exist
        expect(0).to.equal(updatedGame.id);
        expect(updatedGame.players).to.exist
        expect(expectedPlayersArray).to.deep.equal(updatedGame.players);
    });

    it('addPlayerToGame() should throw exception when adding player to a game that does not exist', function() {
        let player = { name : "Test player" };
        let err = chai.assert.throw(() => gameService.addPlayerToGame(INCORRECT_ID, player));
        expect(err).to.be.instanceof(ServiceException);
        expect(err).to.have.property('name', 'ServiceException');
        expect(err).to.have.property('message', EXCEPTION_MESSAGE);
    });
});