const axios = require('axios');

module.exports = {
    getOnlineStatus: () => {
        return axios.get('https://node:3000/status');
    },

    killServer: () => {
        return axios.post('https://node:3000/kill');
    },

    startServer: () => {
        return axios.post('https://node:3000/start');
    }
}