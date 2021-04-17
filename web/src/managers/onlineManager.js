const axios = require('axios');

module.exports = {
    getOnlineStatus: () => {
        return axios.get('http://node:3000/status');
    }
}