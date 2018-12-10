import React from 'react';
import './Card.less';

function Card(props) {
    return(
        <div className="card">
            <img alt={props.imgSrc} src={props.imgSrc}/>
        </div>
    );
}

export default Card;