import chai from 'chai';
import sinon from 'sinon';
import { gameService, GAME_STAGES } from '../../src/services/game-service';
import gameRepository from '../../src/repositories/game-repository';
import RepositoryException from '../../src/common/errors/repository-exception';
import ServiceException from '../../src/common/errors/service-exception';
import cardDeckService from '../../src/services/card-deck-service';
import { Game } from '../../src/interfaces/game-interface';
import { Player } from '../../src/interfaces/player-interface';
import { Suit } from '../../src/interfaces/card-interface';

const expect = chai.expect; // we are using the "expect" style of Chai

describe('GameService Tests', function() {
    const CORRECT_ID = 0;
    const INCORRECT_ID = 1;
    const NEW_ID = 2;
    const EXCEPTION_MESSAGE = 'Game with this id does not exist';
    let game: Game = {
        id: INCORRECT_ID,
        deck: [],
        players: [],
        nextStage: GAME_STAGES.DEAL,
        communityCards: []
    };

    before(function(){
        sinon.stub(gameRepository, 'get').callsFake(
            sinon.fake(function(id: number) {
                if (id === CORRECT_ID)
                    return game
                else
                    throw new RepositoryException(EXCEPTION_MESSAGE);
            })
        );

        sinon.stub(gameRepository, 'put').callsFake(
            sinon.fake(function(game: Game) {
                game.id = NEW_ID;
                return game;
            })
        );

        sinon.stub(gameRepository, 'update').callsFake(
            sinon.fake(function(newVersion: Game) {
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

    it('addPlayer() should add new player to game and return the updated game state', function() {
        let player: Player = { name : "Test player", hand: [] };
        const expectedPlayersArray = [ player ];
        let updatedGame = gameService.addPlayer(CORRECT_ID, player);
        expect(updatedGame).to.exist
        expect(updatedGame.deck).to.not.exist;
        expect(0).to.equal(updatedGame.id);
        expect(updatedGame.players).to.exist
        expect(expectedPlayersArray).to.deep.equal(updatedGame.players);
    });

    it('addPlayer() should throw exception when adding player to a game that does not exist', function() {
        let player: Player = { name : "Test player", hand: [] };
        let err = chai.assert.throw(() => gameService.addPlayer(INCORRECT_ID, player));
        expect(err).to.be.instanceof(ServiceException);
        expect(err).to.have.property('name', 'ServiceException');
        expect(err).to.have.property('message', EXCEPTION_MESSAGE);
    });

    it('dealCardsToPlayers() should throw exception when game not in deal stage', function() {
        game.nextStage = GAME_STAGES.FLOP;
        chai.assert.throws(() => gameService.dealCardsToPlayers(CORRECT_ID), ServiceException);
    });

    it('dealCardsToPlayers() should deal two cards to each of two players and reduce the deck size by four cards', function() {
        game.deck = [
            {
              suit: Suit.hearts,
              "value": 2
            },
            {
              suit: Suit.hearts,
              "value": 3
            },
            {
              suit: Suit.hearts,
              "value": 4
            },
            {
              suit: Suit.hearts,
              "value": 5
            }
        ];
        game.players = [ { name : 'Player 1'}, { name: 'Player 2' } ];

        let updatedGame = gameService.dealCardsToPlayers(CORRECT_ID);
        let players = updatedGame.players;
        expect(players).to.exist
        expect(updatedGame.deck).to.not.exist;
        expect(players[0].hand).to.exist
        expect(players[1].hand).to.exist
        expect(2).to.equal(players[0].hand.length);
        expect(2).to.equal(players[1].hand.length);
        expect([
            {
                suit: Suit.hearts,
                "value": 2
            },
            {
                suit: Suit.hearts,
                "value": 3
            }
        ]).to.deep.equal(players[0].hand);
        expect([
            {
                suit: Suit.hearts,
                "value": 4
            },
            {
                suit: Suit.hearts,
                "value": 5
            }
        ]).to.deep.equal(players[1].hand);
        expect(GAME_STAGES.FLOP).to.equal(updatedGame.nextStage);

        // Need to use internal method, as API method deletes the deck from the game state object
        updatedGame = gameService.getGameInternal(CORRECT_ID);
        expect(0).to.equal(updatedGame.deck.length);
    });

    it('doFlop() should throw exception when game not in flop stage', function() {
        game.nextStage = GAME_STAGES.TURN;
        chai.assert.throws(() => gameService.dealCardsToPlayers(CORRECT_ID), ServiceException);
    });

    it('doFlop() should add three cards to community cards and reduce the deck by three cards', function() {
        game.nextStage = GAME_STAGES.FLOP;
        game.deck = [
            {
              suit: Suit.hearts,
              "value": 2
            },
            {
              suit: Suit.hearts,
              "value": 3
            },
            {
              suit: Suit.hearts,
              "value": 4
            }
        ];

        let updatedGame = gameService.doFlop(CORRECT_ID);
        expect(updatedGame.communityCards).to.exist;
        expect(updatedGame.deck).to.not.exist;
        expect([
            {
              suit: Suit.hearts,
              "value": 2
            },
            {
              suit: Suit.hearts,
              "value": 3
            },
            {
              suit: Suit.hearts,
              "value": 4
            }
        ]).to.deep.equal(updatedGame.communityCards);
        expect(GAME_STAGES.TURN).to.equal(updatedGame.nextStage);

        // Need to use internal method, as API method deletes the deck from the game state object
        updatedGame = gameService.getGameInternal(CORRECT_ID);
        expect(0).to.equal(updatedGame.deck.length);
    });

    it('doTurn() should throw exception when game not in turn stage', function() {
        game.nextStage = GAME_STAGES.RIVER;
        chai.assert.throws(() => gameService.dealCardsToPlayers(CORRECT_ID), ServiceException);
    });

    it('doTurn() should add fourth card to community cards and reduce the deck by one card', function() {
        game.nextStage = GAME_STAGES.TURN;
        game.communityCards = [
            {
                suit: Suit.hearts,
                "value": 2
            },
            {
                suit: Suit.hearts,
                "value": 3
            },
            {
                suit: Suit.hearts,
                "value": 4
            }
        ];
        game.deck = [
            {
                suit: Suit.hearts,
                "value": 5
            }
        ];

        let updatedGame = gameService.doTurn(CORRECT_ID);
        expect(updatedGame.communityCards).to.exist;
        expect(updatedGame.deck).to.not.exist;
        expect([
            {
                suit: Suit.hearts,
                "value": 2
            },
            {
                suit: Suit.hearts,
                "value": 3
            },
            {
                suit: Suit.hearts,
                "value": 4
            },
            {
                suit: Suit.hearts,
                "value": 5
            }
        ]).to.deep.equal(updatedGame.communityCards);
        expect(GAME_STAGES.RIVER).to.equal(updatedGame.nextStage);

        // Need to use internal method, as API method deletes the deck from the game state object
        updatedGame = gameService.getGameInternal(CORRECT_ID);
        expect(0).to.equal(updatedGame.deck.length);
    });

    it('doRiver() should throw exception when game not in river stage', function() {
        game.nextStage = GAME_STAGES.SHOWDOWN;
        chai.assert.throws(() => gameService.dealCardsToPlayers(CORRECT_ID), ServiceException);
    });

    it('doRiver() should add fifth card to community cards and reduce the deck by one card', function() {
        game.nextStage = GAME_STAGES.RIVER;
        game.communityCards = [
            {
                suit: Suit.hearts,
                "value": 2
            },
            {
                suit: Suit.hearts,
                "value": 3
            },
            {
                suit: Suit.hearts,
                "value": 4
            },
            {
                suit: Suit.hearts,
                "value": 5
            }
        ];
        game.deck = [
            {
                suit: Suit.hearts,
                "value": 6
            }
        ];

        let updatedGame = gameService.doRiver(CORRECT_ID);
        expect(updatedGame.communityCards).to.exist;
        expect(updatedGame.deck).to.not.exist;
        expect([
            {
                suit: Suit.hearts,
                "value": 2
            },
            {
                suit: Suit.hearts,
                "value": 3
            },
            {
                suit: Suit.hearts,
                "value": 4
            },
            {
                suit: Suit.hearts,
                "value": 5
            },
            {
                suit: Suit.hearts,
                "value": 6
            }
        ]).to.deep.equal(updatedGame.communityCards);
        expect(GAME_STAGES.SHOWDOWN).to.equal(updatedGame.nextStage);

        // Need to use internal method, as API method deletes the deck from the game state object
        updatedGame = gameService.getGameInternal(CORRECT_ID);
        expect(0).to.equal(updatedGame.deck.length);
    });
});
