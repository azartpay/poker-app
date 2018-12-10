import axios from 'axios';
import REST_CONFIG from '@config/rest-config';

class NewGameService {
    
    createNewGame() {
        return axios.post(`${REST_CONFIG.API_BASE_URL}/newgame`)
                    .then(response => { return response.data; })
                    .catch(err => {throw err.response.data});
    }
}

export default NewGameService;