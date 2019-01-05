import React from 'react';
import './CreateGame.less';
import chip from '../../resources/icons/chip.png';

function CreateGameComponent(props) {
    return (
        <div className="create-game">
            <div className="create-game__form">
                <div className="create-game__title">
                    <img className="create-game__title__icon" src={chip} />
                    <h3 className="create-game__title__text">New poker game</h3>
                </div>
                <form>
                    <input type="text" name="playerName" className="create-game__form__input" placeholder="Player name" />
                    <input type="text" name="maxPlayers" className="create-game__form__input" placeholder="Maximum number of players" />
                    <input type="text" name="initialBid" className="create-game__form__input" placeholder="Initial small bid" />

                    <div className="create-game__buttons">
                        <button type="button" className="create-game__button--cancel">Cancel</button>
                        <button type="button" className="create-game__button--create">Create</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default CreateGameComponent;
