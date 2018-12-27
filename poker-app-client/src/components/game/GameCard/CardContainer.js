import React, { Component } from 'react';
import Card from './Card';
import { resolveCardImage } from '@services/card-image-resolver';

class CardContainer extends Component {

    constructor(props) {
        super(props);
        this.imageSrc = resolveCardImage(this.props.suit, this.props.value);
    }

    render() {
        return (
            <Card imgSrc={this.imageSrc} />
        );
    }
}

export default CardContainer;