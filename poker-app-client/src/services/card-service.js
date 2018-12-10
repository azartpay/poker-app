class CardService {

    getCardImage(suit, value) {
        // TODO This require may not work after bundling.
        return suit && value && require(`@resources/cards/${value}${suit.toUpperCase().charAt(0)}.png`);
    }
}

export default CardService;