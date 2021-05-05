const axios = require('axios');

module.exports = {
    getOnlineStatus: () => {
        return axios.get('https://node:3443/status');
    },

    killServer: () => {
        return axios.post('https://node:3443/kill');
    },

    startServer: () => {
        return axios.post('https://node:3443/start');
    }
}