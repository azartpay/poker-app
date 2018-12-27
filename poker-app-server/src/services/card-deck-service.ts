import { Card } from '../interfaces/card-interface';
import cards from '../resources/deck-of-cards';

import * as _ from 'lodash';

export class CardDeckService {
    cardsDeck: Card[];

    constructor(cards: Card[]) {
        this.cardsDeck = cards;
    }

    readDeckOfCards(): Card[] {
        return Object.assign(this.cardsDeck);
    };

    getShuffledDeckOfCards(): Card[] {
        return this.shuffleDeckOfCards(this.readDeckOfCards());
    }

    shuffleDeckOfCards(cardsDeck: Card[]): Card[] {
        return _.shuffle(cardsDeck);
    }
};

const cardDeckService = new CardDeckService(cards);
export default cardDeckService;
