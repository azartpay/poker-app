import deck from  '../resources/deck-of-cards';

class CardDeckService {

    constructor(deck) {
        this.cardsDeck = deck.cards;
    }

    readDeckOfCards() {
        return Object.assign(this.cardsDeck);
    };

    getShuffledDeckOfCards() {
        return this.shuffleDeckOfCards(this.readDeckOfCards());
    }

    shuffleDeckOfCards(cardsDeck) {
        var ids = Array.from(Array(cardsDeck.length).keys());
    
        return cardsDeck.map(card => {
            var id = ids.splice(Math.floor(Math.random() * ids.length), 1);
            return {'id' : id, 'card' : card};
        }).sort((cardA, cardB) => {
            return cardA.id - cardB.id;
        }).map(card => card.card);
    };
}

const cardDeckService = new CardDeckService(deck);
export default cardDeckService;