var deckOfCards = require('../resources/deck-of-cards.json');

function CardsService() {

    var readDeckOfCards = function() {
        return deckOfCards.slice();
    };

    var shuffleDeckOfCards = function(deckOfCards) {
        var ids = Array.from(Array(deckOfCards.length).keys());
    
        return deckOfCards.map(card => {
            var id = ids.splice(Math.floor(Math.random() * ids.length), 1);
            return {'id' : id, 'card' : card};
        }).sort((cardA, cardB) => {
            return cardA.id - cardB.id;
        }).map(card => card.card);
    };

    return {
        getShuffledDeckOfCards: () => shuffleDeckOfCards(readDeckOfCards()),
        getDeckOfCards: () => readDeckOfCards() 
    }
};

const cardsService = new CardsService();
export default cardsService;