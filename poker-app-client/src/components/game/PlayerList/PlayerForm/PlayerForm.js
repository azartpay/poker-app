import React, {Component} from 'react';

class PlayerForm extends Component {

    constructor(props) {
        super(props);
        this.state = { name : '' };
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(event) {
        this.setState({
            name : event.target.value
        });
    }

    render() {
        return(
            <div>
                <input type="text" name="playerName" placeholder="Enter player's name" onChange={this.handleNameChange} />
                <button onClick={() => this.props.onAddPlayer(this.state)}>Submit</button>    
            </div>
        );
    }
}

export default PlayerForm;