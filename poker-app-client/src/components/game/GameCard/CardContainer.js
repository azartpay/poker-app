import React, { Component } from 'react';
import Card from './Card';
import CardService from '@services/card-service';

class CardContainer extends Component {

    constructor(props) {
        super(props);
        this.cardService = new CardService();
        this.imageSrc = this.cardService.getCardImage(this.props.suit, this.props.value);
    }

    render() {
        return (
            <Card imgSrc={this.imageSrc} />
        );
    }
}

export default CardContainer;