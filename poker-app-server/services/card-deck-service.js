import deck from  '../resources/deck-of-cards';

function CardsService() {

    var readDeckOfCards = function() {
        return Object.assign(deck);
    };

    var shuffleDeckOfCards = function(deck) {
        var ids = Array.from(Array(deck.cards.length).keys());
    
        return deck.cards.map(card => {
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