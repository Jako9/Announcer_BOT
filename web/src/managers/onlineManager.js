const axios = require('axios');

module.exports = {
    getOnlineStatus: () => {
        return axios.get('http://node:3000/status');
    },

    killServer: () => {
        return axios.post('http://node:3000/kill');
    },

    startServer: () => {
        return axios.post('http://node:3000/start');
    }
}