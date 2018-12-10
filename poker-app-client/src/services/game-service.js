import axios from 'axios';
import REST_CONFIG from '@config/rest-config';

class GameService {

    constructor(gameId) {
        this.gameId = gameId;
    }
    
    getGameState() {
        return axios.get(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}`)
                    .then(response => { return response.data; })
                    .catch(err => {throw err.response.data});
    }

    addPlayer(player) {
        return axios.put(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}/addplayer`, player)
                    .then(response => { return response.data })
                    .catch(err => {throw err.response.data});
    }

    dealCards() {
        return axios.put(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}/dealcards`, {})
                    .then(response => { return response.data })
                    .catch(err => {throw err.response.data});
    }

    doFlop() {
        return axios.put(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}/flop`, {})
                    .then(response => { return response.data })
                    .catch(err => {throw err.response.data});
    }

    doTurn() {
        return axios.put(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}/turn`, {})
        .then(response => { return response.data })
        .catch(err => {throw err.response.data});
    }

    doRiver() {
        return axios.put(`${REST_CONFIG.API_BASE_URL}/game/${this.gameId}/river`, {})
                    .then(response => { return response.data })
                    .catch(err => {throw err.response.data});
    }
}

export default GameService;