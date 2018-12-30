import React, { Component }from 'react';
import JoinGameComponent from './JoinGameComponent';
import { withRouter } from 'react-router-dom';

class JoinGameContainer extends Component {
    render() {
        return (
            <div>
                <JoinGameComponent />
            </div>
        );
    }
}

export default withRouter(JoinGameContainer);
