import React, { Component } from 'react';
import CreateGameComponent from './CreateGameComponent';
import { withRouter } from 'react-router-dom';

class CreateGameContainer extends Component {

    render() {
        return (
            <div>
                <CreateGameComponent />
            </div>
        );
    }

}

export default withRouter(CreateGameContainer);