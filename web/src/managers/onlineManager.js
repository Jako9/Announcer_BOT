const axios = require('axios');
const https = require('https');

const agent = new https.Agent({  
    rejectUnauthorized: false
});

module.exports = {
    getOnlineStatus: () => {
        return axios.get('https://node:3443/status',  { httpsAgent: agent });
    },

    killServer: () => {
        return axios.post('https://node:3443/kill',  { httpsAgent: agent });
    },

    startServer: () => {
        return axios.post('https://node:3443/start',  { httpsAgent: agent });
    }
}