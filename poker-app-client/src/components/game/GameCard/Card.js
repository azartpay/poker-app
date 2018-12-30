import React from 'react';
import './Card.less';

function Card(props) {
    return(
        <div className="card">
            <img  className="card__image" alt={props.imgSrc} src={props.imgSrc}/>
        </div>
    );
}

export default Card;